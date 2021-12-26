<template>
  <div class="el-input">
    <input
      type="text"
      id="demo"
      autocomplete="off"
      placeholder="请输入内容"
      autofocus
      debounce="300"
      class="el-input__inner"
      aria-autocomplete="list"
      v-model="keywords"
    />
  </div>
</template>
<script>
import { uniq } from 'awesome-utils-normal';

export default {
  name: 'tree-filter',
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      keywords: '',
      originData: this.treeData,
    };
  },
  computed: {
    table() {
      return this.$parent;
    },
  },
  methods: {
    treeFindPath(tree, func, path = [], result = []) {
      tree.forEach((data) => {
        path.push(data.name);
        if (func(data)) {
          result.push([...path]);
        }
        if (data.children) {
          this.treeFindPath(data.children, func, path, result);
        }
        path.pop();
      });
      return result;
    },
    // 树转换为列表
    treeToList(tree, result = [], parentName = '') {
      tree.forEach((node) => {
        node.parentName = parentName;
        result.push(node);
        if (node.children) {
          this.treeToList(node.children, result, node.name);
        }
      });
      return result;
    },
    // 列表转换回树
    listToTree(list) {
      const info = list.reduce(
        (map, node) => (
          map[node.name] = node, node.children = [], map
        ),
        {},
      );
      return list.filter((node) => {
        if (info[node.parentName]) {
          info[node.parentName].children.push(node);
        }
        return !node.parentName;
      });
    },
    filterTree(array, final) {
      // 1.转换成列表
      const newData = this.treeToList(array);
      // 2.将不相关的节点删除掉
      const filterArray = newData.filter(item => final.includes(item.name));
      // 3.将列表再转换成树
      const filterTree = this.listToTree(filterArray);
      return filterTree;
    },
  },
  mounted() {
    const search = document.getElementsByTagName('input')[0];
    search.oninput = () => {
      if (this.keywords) {
        const jj = this.treeFindPath(
          this.originData,
          node => node.name.indexOf(this.keywords) > -1,
        );
        let final = [];
        jj.map((item) => {
          const temp = [...item];
          final = final.concat(temp);
          return item;
        });
        this.filterTree(this.originData, uniq(final));
        this.$emit('recieveData', this.originData);
      }
    };
  },
};
</script>
<style lang="less" scoped>
</style>

