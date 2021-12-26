<template>
  <div class="tree-wrapper">
    <!-- <ul class="switch-list">
      <li class="switch-item" v-for="item in propList">
        <span>{{ item.name }}: </span>
        <zk-switch v-model="props[item.name]"></zk-switch>
      </li>
    </ul> -->
    <tree-filter :treeData="data" @recieveData="filterData"></tree-filter>
    <zk-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="data2"
      :columns="columns"
      :stripe="props.stripe"
      :border="props.border"
      :show-account="props.showAccount"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-row-click="props.showRowClick"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :is-expanded="props.isExpanded"
      :expand-type="props.expandType"
      :selection-type="props.selectionType"
      :expand-column="props.expandColumn"
      :account-column="props.accountColumn"
      :expand-column-num="props.expandColumnNum">
      <template slot="expand" slot-scope="scope">
        <div class="extend-table">
          <span
            v-for="space in scope.row._level"
            :key="space"
            class="ms-tree-space"
          ></span>
          <zk-table
            ref="simpleTable"
            :data="scope.row.sub_account_list"
            :columns="accountColumns"
            :stripe="accountProps.stripe"
            :border="accountProps.border"
            :show-header="accountProps.showHeader"
            :show-summary="accountProps.showSummary"
            :show-row-hover="accountProps.showRowHover"
            :show-index="accountProps.showIndex"
            :tree-type="accountProps.treeType"
            :is-fold="accountProps.isFold"
            :is-expanded="accountProps.isExpanded"
            :expand-type="accountProps.expandType"
            :selection-type="accountProps.selectionType">
            <template slot="operation">
              <button>解除关联</button>
              <button>变更组织</button>
            </template>
          </zk-table>
        </div>
      </template>
      <template slot="likes" slot-scope="scope">
        {{ scope.row.likes.join(',') }}
      </template>
    </zk-table>
  </div>
</template>

<script>
import TreeFilter from './TreeFilter/TreeFilter';
import ZkSwitch from './Switch/Switch';

export default {
  name: 'example',
  components: {
    ZkSwitch,
    TreeFilter,
  },
  data() {
    return {
      props: {
        stripe: true,
        border: false,
        showAccount: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showRowClick: false,
        showIndex: false,
        treeType: true,
        isFold: false,
        expandType: true,
        isExpanded: false,
        selectionType: false,
        expandColumn: 'score',
        accountColumn: 'main_account',
        expandColumnNum: 3,
      },
      data: [
        {
          name: 'Jack',
          sex: 'male',
          likes: ['football', 'basketball'],
          score: 4,
          main_account: 'test',
          sub_account_list: [
            {
              sub_account_user_id: '1',
              sub_account_user_name: 'liulaogen',
              sub_account_display_name: 'liulaogen',
              sub_account_relation_status: 1,
              sub_account_relation_time: 1638685732000,
              org_id: '1',
              org_name: '123233',
            },
            {
              sub_account_user_id: '2',
              sub_account_user_name: 'jinmantang',
              sub_account_display_name: 'jinmantang',
              sub_account_relation_status: 1,
              sub_account_relation_time: 1638686832000,
              org_id: '1',
              org_name: '123233',
            },
            {
              sub_account_user_id: '3',
              sub_account_user_name: 'zhangkanjia',
              sub_account_display_name: 'zhangkanjia',
              sub_account_relation_status: 1,
              sub_account_relation_time: 1639551093000,
              org_id: '1',
              org_name: '123233',
            },
            {
              sub_account_user_id: '4',
              sub_account_user_name: 'liumanjiang',
              sub_account_display_name: 'liumanjiang',
              sub_account_relation_status: 1,
              sub_account_relation_time: 1639551207000,
              org_id: '1',
              org_name: '123233',
            },
          ],
          children: [
            {
              name: 'Ashley1',
              sex: 'female',
              likes: ['football', 'basketball'],
              score: 4,
              children: [
                {
                  name: 'Ashley2',
                  sex: 'female',
                  likes: ['football', 'basketball'],
                  score: 0,
                  sub_account_list: [],
                  children: [],
                },
                {
                  name: 'Taki1',
                  sex: 'male',
                  likes: ['football', 'basketball'],
                  score: 0,
                  sub_account_list: [],
                  children: [
                    {
                      name: 'Ashley3',
                      sex: 'female',
                      likes: ['football', 'basketball'],
                      score: 0,
                      sub_account_list: [],
                      children: [],
                    },
                    {
                      name: 'Tak3',
                      sex: 'male',
                      likes: ['football', 'basketball'],
                      score: 0,
                      sub_account_list: [],
                      children: [
                        {
                          name: 'Ashley4',
                          sex: 'female',
                          likes: ['football', 'basketball'],
                          score: 0,
                          sub_account_list: [],
                        },
                        {
                          name: 'Taki4',
                          sex: 'male',
                          likes: ['football', 'basketball'],
                          score: 0,
                          sub_account_list: [],
                        },
                      ],
                    },
                  ],
                },
              ],
              sub_account_list: [
                {
                  sub_account_user_id: '1',
                  sub_account_user_name: 'liulaogen',
                  sub_account_display_name: 'liulaogen',
                  sub_account_relation_status: 1,
                  sub_account_relation_time: 1638685732000,
                  org_id: '1',
                  org_name: '123233',
                },
                {
                  sub_account_user_id: '2',
                  sub_account_user_name: 'jinmantang',
                  sub_account_display_name: 'jinmantang',
                  sub_account_relation_status: 1,
                  sub_account_relation_time: 1638686832000,
                  org_id: '1',
                  org_name: '123233',
                },
                {
                  sub_account_user_id: '3',
                  sub_account_user_name: 'zhangkanjia',
                  sub_account_display_name: 'zhangkanjia',
                  sub_account_relation_status: 1,
                  sub_account_relation_time: 1639551093000,
                  org_id: '1',
                  org_name: '123233',
                },
                {
                  sub_account_user_id: '4',
                  sub_account_user_name: 'liumanjiang',
                  sub_account_display_name: 'liumanjiang',
                  sub_account_relation_status: 1,
                  sub_account_relation_time: 1639551207000,
                  org_id: '1',
                  org_name: '123233',
                },
              ],
            },
            {
              name: 'Taki',
              sex: 'male',
              likes: ['football', 'basketball'],
              score: 0,
              sub_account_list: [],
              children: [],
            },
          ],
        },
      ],
      data2: [],
      columns: [
        {
          label: 'name',
          prop: 'name',
          width: '400px',
        },
        {
          label: 'sex',
          prop: 'sex',
          minWidth: '50px',
        },
        {
          label: 'score',
          prop: 'score',
          minWidth: '130px',
        },
        {
          label: 'likes',
          prop: 'likes',
          minWidth: '200px',
          type: 'template',
          template: 'likes',
        },
      ],
      accountProps: {
        stripe: true,
        border: false,
        showAccount: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: false,
        isFold: true,
        expandType: false,
        isExpanded: false,
        selectionType: false,
      },
      accountColumns: [
        {
          label: '子账号名称',
          prop: 'sub_account_user_name',
          minWidth: 180,
          headerAlign: 'left',
          align: 'left',
        },
        {
          label: '显示名',
          prop: 'sub_account_display_name',
          minWidth: 160,
          headerAlign: 'left',
          align: 'left',
        },
        {
          label: '关联状态',
          prop: 'sub_account_relation_status',
          minWidth: 90,
          headerAlign: 'left',
          align: 'left',
        },
        {
          label: '关联时间',
          prop: 'sub_account_relation_time',
          minWidth: 140,
          headerAlign: 'left',
          align: 'left',
        },
        {
          label: '操作',
          prop: 'operation',
          minWidth: 250,
          headerAlign: 'left',
          align: 'left',
          type: 'template',
          template: 'operation',
        },
      ],
    };
  },
  computed: {
    propList() {
      return Object.keys(this.props).map(item => ({
        name: item,
      }));
    },
  },
  methods: {
    // 增加节点每一层级是否是最后一个的属性
    handleNode(array) {
      const recursionList = (data, _last) => {
        const temp = data.map((item, index, arr) => {
          item._last = [..._last, index === arr.length - 1];
          if (
            item.children &&
            item.children instanceof Array &&
            item.children.length
          ) {
            recursionList(item.children, item._last);
          }
          return item;
        });
        return temp;
      };
      return recursionList(array, []);
    },
    filterData(value) {
      this.data2 = this.handleNode(value);
    },
  },
  created() {
    this.data2 = JSON.parse(JSON.stringify(this.data));
    this.handleNode(this.data2);
  },
};
</script>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
.tree-wrapper {
  overflow-y: overlay;
  width: calc(~"100vw - 30px");
  .switch-list {
    margin: 20px 0;
    list-style: none;
    overflow: hidden;
  }

  .switch-item {
    margin: 20px;
    float: left;
  }
  .ms-tree-space {
    position: relative;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 24px; /* 这个千万别动 */
    height: 14px;
  }
  .ms-tree-space::before {
    content: '';
  }
  .extend-table {
    width: 90%;
    min-width: 948px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    padding: 0;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -moz-box-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
}
</style>
