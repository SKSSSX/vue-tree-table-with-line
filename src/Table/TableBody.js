import Checkbox from '../Checkbox/Checkbox'; // eslint-disable-line
import { mixins } from './utils';

/* eslint-disable no-underscore-dangle */
export default {
  name: 'zk-table__body',
  mixins: [mixins],
  data() {
    return {};
  },
  computed: {
    table() {
      return this.$parent;
    },
  },
  methods: {
    toggleStatus(type, row, rowIndex, value) {
      this.validateType(
        type,
        ['Expanded', 'Checked', 'Hide', 'Fold'],
        'toggleStatus',
        false,
      );
      const target = this.table.bodyData[rowIndex];
      this.table.bodyData.splice(rowIndex, 1, {
        ...target,
        [`_is${type}`]:
          typeof value === 'undefined' ? !row[`_is${type}`] : value,
      });
    },
    // 节点级联操作拓展行关闭
    closeExpanded(type, row, rowIndex, value) {
      this.validateType(type, ['Expanded'], 'closeExpanded', false);
      const target = this.table.bodyData[rowIndex];
      this.table.bodyData.splice(rowIndex, 1, {
        ...target,
        [`_is${type}`]: typeof value === 'undefined' ? false : value,
      });
    },
    getChildrenIndex(parentLevel, parentIndex, careFold = true) {
      const data = this.table.bodyData;
      let childrenIndex = [];
      for (let i = parentIndex + 1; i < data.length; i++) {
        if (data[i]._level <= parentLevel) break;
        if (data[i]._level - 1 === parentLevel) {
          childrenIndex.push(i);
        }
      }
      const len = childrenIndex.length; // important!!!
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          const childData = data[childrenIndex[i]];
          if (
            childData._childrenLen &&
            (!careFold || (careFold && !childData._isFold))
          ) {
            childrenIndex = childrenIndex.concat(
              this.getChildrenIndex(
                childData._level,
                childrenIndex[i],
                careFold,
              ),
            );
          }
        }
      }
      return childrenIndex;
    },
    handleEvent($event, type, data, others) {
      const certainType = this.validateType(
        type,
        ['cell', 'row', 'checkbox', 'icon'],
        'handleEvent',
      );
      const eventType = $event ? $event.type : '';
      const { row, rowIndex, column, columnIndex } = data;
      const latestData = this.table.bodyData;
      // Checkbox
      if (certainType.checkbox) {
        const { isChecked } = others;
        this.toggleStatus('Checked', row, rowIndex, isChecked);
        if (row._childrenLen > 0) {
          const childrenIndex = this.getChildrenIndex(
            row._level,
            rowIndex,
            false,
          );
          for (let i = 0; i < childrenIndex.length; i++) {
            this.toggleStatus(
              'Checked',
              latestData[childrenIndex[i]],
              childrenIndex[i],
              isChecked,
            );
          }
        }
        return this.table.$emit(
          'checkbox-click',
          latestData[rowIndex],
          column,
          columnIndex,
          $event,
        );
      }
      // Tree's icon
      if (certainType.icon) {
        $event.stopPropagation();
        this.toggleStatus('Fold', row, rowIndex);
        if (!row._isFold) {
          this.closeExpanded('Expanded', row, rowIndex);
        }
        const childrenIndex = this.getChildrenIndex(row._level, rowIndex);
        for (let i = 0; i < childrenIndex.length; i++) {
          this.toggleStatus(
            'Hide',
            latestData[childrenIndex[i]],
            childrenIndex[i],
          );
          if (!row._isFold) {
            this.closeExpanded(
              'Expanded',
              latestData[childrenIndex[i]],
              childrenIndex[i],
            );
          }
        }
        return this.table.$emit(
          'tree-icon-click',
          latestData[rowIndex],
          column,
          columnIndex,
          $event,
        );
      }
      if (certainType.cell && eventType === 'click') {
        // 点击扩展单元格
        if (this.isExpandCell(this.table, columnIndex)) {
          this.toggleStatus('Expanded', row, rowIndex);
          return this.table.$emit(
            'expand-cell-click',
            latestData[rowIndex],
            column,
            columnIndex,
            $event,
          );
        }
          // 先移除其余行的选中样式
        latestData.map((tr) => {
          tr._isSelected = false;
          return tr;
        });
        const target = latestData[rowIndex];
        latestData.splice(rowIndex, 1, {
          ...target,
          _isSelected: true,
        });
        return this.table.$emit(
            'cell-click',
            latestData[rowIndex],
            column,
            columnIndex,
            $event,
          );
      }
      // 行：Hover
      if (
        certainType.row &&
        (eventType === 'mouseenter' || eventType === 'mouseleave')
      ) {
        const { hover } = others;
        const target = latestData[rowIndex];
        latestData.splice(rowIndex, 1, {
          ...target,
          _isHover: hover,
        });
      }
      if (certainType.cell) {
        return this.table.$emit(
          `${type}-${eventType}`,
          latestData[rowIndex],
          rowIndex,
          column,
          columnIndex,
          latestData[row._parentIndex],
          row._parentIndex,
          $event,
        );
      }
      return this.table.$emit(
        `${type}-${eventType}`,
        latestData[rowIndex],
        rowIndex,
        $event,
      );
    },
  },
  render() {
    // key
    function getKey(row, rowIndex) {
      const rowKey = this.table.rowKey;
      if (rowKey) {
        return rowKey.call(null, row, rowIndex);
      }
      return rowIndex;
    }

    // style
    function getStyle(type, row, rowIndex, column, columnIndex) {
      const certainType = this.validateType(type, ['cell', 'row'], 'getStyle');
      const style = this.table[`${type}Style`];
      if (typeof style === 'function') {
        if (certainType.row) {
          return style.call(null, row, rowIndex);
        }
        if (certainType.cell) {
          return style.call(null, row, rowIndex, column, columnIndex);
        }
      }
      return style;
    }

    // className
    function getClassName(type, row, rowIndex, column, columnIndex) {
      const certainType = this.validateType(
        type,
        ['cell', 'row', 'inner'],
        'getClassName',
      );
      const classList = [];
      if (certainType.row || certainType.cell) {
        const className = this.table[`${type}ClassName`];
        if (typeof className === 'string') {
          classList.push(className);
        } else if (typeof className === 'function') {
          if (certainType.row) {
            classList.push(className.call(null, row, rowIndex) || '');
          }
          if (certainType.cell) {
            classList.push(
              className.call(null, row, rowIndex, column, columnIndex) || '',
            );
          }
        }
        if (certainType.row) {
          classList.push(`${this.prefixCls}__body-row`);
          if (this.table.stripe && rowIndex % 2 !== 0) {
            classList.push(`${this.prefixCls}--stripe-row`);
          }
          if (this.table.showRowHover && row._isHover) {
            classList.push(`${this.prefixCls}--row-hover`);
          }
          if (this.table.showRowClick && row._isSelected) {
            classList.push(`${this.prefixCls}--row-select`);
          }
        }
        if (certainType.cell) {
          classList.push(`${this.prefixCls}__body-cell`);
          if (this.table.border) {
            classList.push(`${this.prefixCls}--border-cell`);
          }
          const align = column.align;
          if (['center', 'right'].indexOf(align) > -1) {
            classList.push(`${this.prefixCls}--${align}-cell`);
          }
        }
      }
      if (certainType.inner) {
        classList.push(`${this.prefixCls}__cell-inner`);
        if (this.isExpandCell(this.table, columnIndex)) {
          classList.push(`${this.prefixCls}--expand-inner`);
          if (row._isExpanded) {
            classList.push(`${this.prefixCls}--expanded-inner`);
          }
        }
      }
      return classList.join(' ');
    }

    // 根据type渲染单元格Cell
    function renderCell(row, rowIndex, column, columnIndex) {
      // ExpandType
      if (this.isExpandCell(this.table, columnIndex)) {
        if (Number(row[this.table.expandColumn]) > 0) {
          return <i class="zk-icon zk-icon-angle-right" />;
        }
        return '';
      }
      // SelectionType's Checkbox
      if (this.isSelectionCell(this.table, columnIndex)) {
        let allCheck;
        let childrenIndex;
        const hasChildren = row._childrenLen > 0;
        if (hasChildren) {
          childrenIndex = this.getChildrenIndex(row._level, rowIndex, false);
          allCheck = true;
          for (let i = 0; i < childrenIndex.length; i++) {
            if (!this.table.bodyData[childrenIndex[i]]._isChecked) {
              allCheck = false;
              break;
            }
          }
        } else {
          allCheck = row._isChecked;
        }
        let indeterminate = false;
        if (hasChildren && !allCheck) {
          for (let i = 0; i < childrenIndex.length; i++) {
            if (this.table.bodyData[childrenIndex[i]]._isChecked) {
              indeterminate = true;
              break;
            }
          }
        }
        return (
          <Checkbox
            indeterminate={indeterminate}
            value={allCheck}
            onOn-change={isChecked =>
              this.handleEvent(
                null,
                'checkbox',
                { row, rowIndex, column, columnIndex },
                { isChecked },
              )
            }
          />
        );
      }
      // Tree's firstProp
      if (this.table.treeType && this.table.firstProp === column.prop) {
        return (
          <span
            class={`${this.prefixCls}--level-${row._level}-cell`}
            style={{
              marginLeft: `${(row._level - 1) * 24}px`,
              paddingLeft: row._childrenLen === 0 ? '20px' : '',
              lineHeight: '16px',
              display: 'inline-block',
              // borderLeft: '1px solid #000'
            }}
          >
            {row._level > 1 && (
                <i
                  class={`${this.prefixCls}--tree-top-line`}
                  style={{
                    marginLeft: `${(row._level - 1) * 24}px`,
                  }}
                />
              )}
            {row._level > 1 && (
              <i
                class={`${this.prefixCls}--tree-left-line`}
                style={{
                  marginLeft: `${(row._level - 1) * 24}px`,
                }}
              />
            )}
            {row._childrenLen > 0 &&
              !row._isFold && (
                <i
                  class={`${this.prefixCls}--tree-bottom-line`}
                  style={{
                    marginLeft: `${(row._level - 1) * 24}px`,
                  }}
                />
              )}
            {row._level > 1 &&
              !row._last[row._level - 1] && (
                <i
                  class={`${this.prefixCls}--tree-left-bottom-line`}
                  style={{
                    marginLeft: `${(row._level - 1) * 24}px`,
                  }}
                />
              )}
            {row._level > 2 &&
              row._last &&
              !row._last[1] && (
                <i
                  class={`${this.prefixCls}--tree-level1-line`}
                  style={{
                    marginLeft: `${(row._level - 1) * 24}px`,
                    left: `${(row._level - 2) * (-24) - 5}px`,
                  }}
                />
              )}
            {row._level === 4 &&
              row._last &&
              !row._last[2] && (
                <i
                  class={`${this.prefixCls}--tree-level2-line`}
                  style={{
                    left: `${(row._level - 2) * 22 - 1}px`,
                  }}
                />
              )}
            {row._level > 4 &&
              row._last &&
              !row._last[2] &&
              !row._last[3] &&
              !row.nodeType && (
                <i
                  class={`${this.prefixCls}--tree-level2-line`}
                  style={{
                    left: `${(row._level - 3) * 22 - 1}px`,
                  }}
                />
              )}
            {row._level > 4 &&
              row._last &&
              !row._last[2] &&
              row.nodeType &&
              row.nodeType === 'subAccount' && (
                <i
                  class={`${this.prefixCls}--tree-level2-line`}
                  style={{
                    left:
                      row._level < 6
                        ? `${(row._level - 3) * 22 - 1}px`
                        : `${(row._level - 4) * 22 - 1}px`,
                  }}
                />
              )}
            {row._level === 5 &&
              row._last &&
              !row._last[3] && (
                <i
                  class={`${this.prefixCls}--tree-level3-line`}
                  style={{
                    left: `${(row._level - 3) * 33 + 1}px`,
                  }}
                />
              )}
            {row._level > 5 &&
              row._last &&
              !row._last[3] &&
              row.nodeType &&
              row.nodeType === 'subAccount' && (
                <i
                  class={`${this.prefixCls}--tree-level3-line`}
                  style={{
                    left:
                      row._level < 6
                        ? `${(row._level - 3) * 33 + 1}px`
                        : `${(row._level - 4) * 33 + 1}px`,
                  }}
                />
              )}
            {row._childrenLen > 0 && (
              <i
                class={`${this.prefixCls}--tree-icon zk-icon zk-icon-${
                  row._isFold ? 'plus' : 'minus'
                }-square-o`}
                on-click={$event =>
                  this.handleEvent(
                    $event,
                    'icon',
                    { row, rowIndex, column, columnIndex },
                    { isFold: row._isFold },
                  )
                }
              />
            )}
            {this.table.showAccount &&
              row[column.prop] &&
              row._level === 1 && (
                <p class={`${this.prefixCls}--tree-account-wrapper`}>
                  <span>{row[column.prop]}</span>{' '}
                  <span class={`${this.prefixCls}--tree-account`}>
                    【主账号: {row[this.table.accountColumn]}】
                  </span>
                </p>
              )}
            {this.table.showAccount &&
            row[column.prop] &&
            row._level > 1 &&
            row[column.prop]
              ? row[column.prop]
              : ''}
            {!this.table.showAccount && !row.nodeType && row[column.prop]
              ? row[column.prop]
              : ''}
            {!this.table.showAccount && row.nodeType && row[column.prop] ? (
              <span>
                <i
                  class={`${
                    this.prefixCls
                  }--tree-icon zk-icon zk-icon-simple-person`}
                />
                {row[column.prop]}
              </span>
            ) : (
              ''
            )}
          </span>
        );
      }
      // TreeType children's index
      if (
        this.table.showIndex &&
        this.table.treeType &&
        column.prop === '_normalIndex' &&
        row._level > 1
      ) {
        return '';
      }
      if (column.type === undefined || column.type === 'custom') {
        return row[column.prop];
      } else if (column.type === 'template') {
        return this.table.$scopedSlots[column.template]
          ? this.table.$scopedSlots[column.template]({
            row,
            rowIndex,
            column,
            columnIndex,
          })
          : '';
      }
      return '';
    }

    // Template
    return (
      <table
        cellspacing="0"
        cellpadding="0"
        border="0"
        class={`${this.prefixCls}__body`}
      >
        <colgroup>
          {this.table.tableColumns.map(column => (
            <col
              width={column.computedWidth || column.minWidth || column.width}
            />
          ))}
        </colgroup>
        <tbody>
          {this.table.bodyData.length > 0 ? (
            this.table.bodyData.map((row, rowIndex) => [
              <tr
                v-show={!row._isHide}
                key={
                  this.table.rowKey
                    ? getKey(row, rowIndex)
                    : row[this.table.firstProp]
                }
                style={getStyle.call(this, 'row', row, rowIndex)}
                class={getClassName.call(this, 'row', row, rowIndex)}
                on-click={$event =>
                  this.handleEvent(
                    $event,
                    'row',
                    { row, rowIndex },
                    { selected: true },
                  )
                }
                on-dblclick={$event =>
                  this.handleEvent($event, 'row', { row, rowIndex })
                }
                on-contextmenu={$event =>
                  this.handleEvent($event, 'row', { row, rowIndex })
                }
                on-mouseenter={$event =>
                  this.handleEvent(
                    $event,
                    'row',
                    { row, rowIndex },
                    { hover: true },
                  )
                }
                on-mouseleave={$event =>
                  this.handleEvent(
                    $event,
                    'row',
                    { row, rowIndex },
                    { hover: false },
                  )
                }
              >
                {this.table.tableColumns.map((column, columnIndex) => (
                  <td
                    style={getStyle.call(
                      this,
                      'cell',
                      row,
                      rowIndex,
                      column,
                      columnIndex,
                    )}
                    class={getClassName.call(
                      this,
                      'cell',
                      row,
                      rowIndex,
                      column,
                      columnIndex,
                    )}
                    on-click={$event =>
                      this.handleEvent($event, 'cell', {
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                      })
                    }
                    on-dblclick={$event =>
                      this.handleEvent($event, 'cell', {
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                      })
                    }
                    on-contextmenu={$event =>
                      this.handleEvent($event, 'cell', {
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                      })
                    }
                    on-mouseenter={$event =>
                      this.handleEvent($event, 'cell', {
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                      })
                    }
                    on-mouseleave={$event =>
                      this.handleEvent($event, 'cell', {
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                      })
                    }
                  >
                    <div
                      class="zk-table--level-1-cell"
                      style="margin-left: 0px; display: inline-block;"
                      v-show={
                        this.table.expandType &&
                        column.prop == this.table.expandColumn
                      }
                    >
                      <span class="zk-table__cell-inner">
                        {row[column.prop]}
                      </span>
                    </div>
                    <div
                      class={getClassName.call(
                        this,
                        'inner',
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                      )}
                    >
                      {renderCell.call(
                        this,
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                      )}
                    </div>
                  </td>
                ))}
              </tr>,
              this.table.expandType &&
                row._isExpanded &&
                row[this.table.expandColumn] > 0 && (
                  <tr
                    key={rowIndex}
                    class={`${this.prefixCls}__body-row ${
                      this.prefixCls
                    }--expand-row`}
                  >
                    <td
                      class={`${this.prefixCls}--expand-content`}
                      colspan={this.table.tableColumns.length}
                    >
                      {row._childrenLen > 0 &&
                        !row._isFold && (
                          <i
                            class={`${this.prefixCls}--expand-left-line`}
                            style={{
                              marginLeft: `${(row._level - 1) * 24 + 1}px`,
                            }}
                          />
                        )}
                      {row._level > 1 &&
                        !row._last[1] && (
                          <i class={`${this.prefixCls}--expand-level1-line`} />
                        )}
                      {row._level > 2 &&
                        !row._last[2] && (
                          <i class={`${this.prefixCls}--expand-level2-line`} />
                        )}
                      {row._level > 3 &&
                        !row._last[3] && (
                          <i class={`${this.prefixCls}--expand-level3-line`} />
                        )}
                      {row._level > 4 &&
                        !row._last[4] && (
                          <i class={`${this.prefixCls}--expand-level4-line`} />
                        )}
                      {this.table.$scopedSlots.expand
                        ? this.table.$scopedSlots.expand({ row, rowIndex })
                        : ''}
                    </td>
                  </tr>
                ),
            ])
          ) : (
            <tr class={`${this.prefixCls}--empty-row`}>
              <td
                class={`${this.prefixCls}__body-cell ${
                  this.prefixCls
                }--empty-content`}
                colspan={this.table.tableColumns.length}
              >
                {this.table.emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  },
};
