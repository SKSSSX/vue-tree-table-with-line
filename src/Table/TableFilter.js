import { mixins } from './utils';

/* eslint-disable no-underscore-dangle */
export default {
  name: 'zk-table__filter',
  mixins: [mixins],
  data() {
    return {
      keywords: '',
    };
  },
  computed: {
    table() {
      return this.$parent;
    },
  },
  methods: {
    // nodes就是树形的最原始数据，query就是关键字，最后会返回满足条件的节点数组
    filter(nodes, query) {
      // 条件就是节点的title过滤关键字
      const predicate = function (node) {
        if (node.name.indexOf(query) > -1) {
          return true;
        }
        return false;
      };
      if (!(nodes && nodes.length)) {
        return [];
      }
      const newChildren = [];
      for (const node of nodes) {
        // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
        // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
        // 2. 自己本身符合条件
        // let subs = this.filter(node.children, query);
        // if (predicate(node)) {
        //   newChildren.push(node);
        // } else if (subs && subs.length) {
        //   node.children = subs;
        //   newChildren.push(node);
        // }

        // 以下只需要考虑自身的节点满足条件即可,不用带上父节点
        if (predicate(node)) {
          newChildren.push(node);
          node.children = this.filter(node.children, query);
        } else {
          newChildren.push(...this.filter(node.children, query));
        }
      }
      return newChildren.length ? newChildren : [];
    },
  },
  render() {
    // Template
    return (
      <div class="el-input el-input--suffix">
        <input
          type="text"
          id="demo"
          autocomplete="off"
          placeholder="请输入内容"
          autofocus
          debounce="300"
          class="el-input__inner"
          aria-autocomplete="list"
          value={this.keywords}
        />
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-icon-search el-input__icon" />
          </span>
        </span>
      </div>
    );
  },
  mounted() {
    let kkk = JSON.parse(JSON.stringify(this.table.data));
    let search = document.getElementsByTagName('input')[0];
    search.oninput = () => {
      this.keywords = search.value;
      if (this.keywords) {
        let jj = this.filter(this.table.data, this.keywords);
        this.table.data = jj;
      } else {
        this.table.data = [];
        this.table.data = kkk;
      }

    }
    let btn = document.getElementsByClassName('el-input__suffix')[0];
    btn.onclick = () => {
      this.table.data = this.filter(this.table.data, this.keywords);
    }
  },
};
