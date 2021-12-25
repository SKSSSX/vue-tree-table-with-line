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
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i class="el-icon-search el-input__icon" />
      </span>
    </span>
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
      kkk: this.treeData,
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
    filterOrgan(array, final) {
      let recursionList = (data, final) => {
        data.map((item, index, arr) => {
          if (final.includes(item.name)) {
            if (
              item.children &&
              item.children instanceof Array &&
              item.children.length
            ) {
              recursionList(item.children, final);
            }
          } else {
            arr.splice(index, 1);
          }
        });
      };
      recursionList(array, final);
    },
  },
  mounted() {
    let search = document.getElementsByTagName('input')[0];
    search.oninput = () => {
      if (this.keywords) {
        let jj = this.treeFindPath(this.kkk, node => node.name.indexOf(this.keywords) > -1);
        let final = [];
        jj.map(item => {
          let temp = [...item];
          final = final.concat(temp);
        });
        this.filterOrgan(this.kkk, uniq(final));
        this.$emit('recieveData', this.kkk);
      } else {
        console.log(this.treeData);
      }
    }
    let btn = document.getElementsByClassName('el-input__suffix')[0];
    btn.onclick = () => {
      let result = this.treeFindPath(this.kkk, node => node.name.indexOf(this.keywords) > -1);
      let final = [];
      result.map(item => {
        let temp = [...item];
        final = final.concat(temp);
      });
      this.filterOrgan(this.kkk, uniq(final));
      this.$emit('recieveData', this.kkk);
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

