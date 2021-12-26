<template>
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
      v-model="keywords"
    />
    <!-- <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i class="el-icon-search el-input__icon" />
      </span>
    </span> -->
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
    }
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
      for (const data of tree) {
        path.push(data.name);
        func(data) && result.push([...path]);
        data.children && this.treeFindPath(data.children, func, path, result);
        path.pop();
      }
      return result;
    },
    // 树转换为列表
    treeToList (tree, result = [], parentName = "") {
      tree.forEach(node => {
        node.parentName = parentName;
        result.push(node)
        node.children && this.treeToList(node.children, result, node.name);
      })
      return result;
    },
    // 列表转换回树
    listToTree (list) {
      let info = list.reduce((map, node) => (map[node.name] = node, node.children = [], map), {})
      return list.filter(node => {
        info[node.parentName] && info[node.parentName].children.push(node)
        return !node.parentName
      })
    },
    filterTree(array, final) {
      // 1.转换成列表
      const newData = this.treeToList(array);
      console.log(newData);
      // 2.将不相关的节点删除掉
      const filterArray = newData.filter(item => {
        return final.includes(item.name);
      });
      console.log(filterArray, final);
      // 3.将列表再转换成树
      const filterTree = this.listToTree(filterArray);
      console.log(filterTree);
      return filterTree;
    },
  },
  mounted() {
    let search = document.getElementsByTagName('input')[0];
    search.oninput = () => {
      if (this.keywords) {
        let jj = this.treeFindPath(this.originData, node => node.name.indexOf(this.keywords) > -1);
        let final = [];
        jj.map(item => {
          let temp = [...item];
          final = final.concat(temp);
        });
        this.filterTree(this.originData, uniq(final));
        this.$emit('recieveData', this.originData);
      }
    }
    let btn = document.getElementsByClassName('el-input__suffix')[0];
    btn.onclick = () => {
      let result = this.treeFindPath(this.originData, node => node.name.indexOf(this.keywords) > -1);
      let final = [];
      result.map(item => {
        let temp = [...item];
        final = final.concat(temp);
      });
      this.filterTree(this.originData, uniq(final));
      this.$emit('recieveData', this.originData);
    }
  },
};
</script>
<style lang="less" scoped>
.el-input__suffix {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: red;
}
</style>

