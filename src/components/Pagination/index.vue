<template>
  <div class="pagination-container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="newPage.pageIndex"
      :page-sizes="[10,20,30,50]"
      :page-size="newPage.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "Pagination",
  props: {
    total: {
      type: Number,
      default: 1000
    },
    listQuery: {
      type: Object,
      default:{}
    }
  },
  data() {
    return {
      pageSize: 0,
      newPageIndex:0,
      newPage:{}
    };
  },

  methods: {
    /**一页展示多少条数据 */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      localStorage.setItem("totalPage", val);
      this.listQuery.pageIndex = 1;
      this.$emit("PageChange", this.listQuery);
    },
    /**当前页数改变 */
    handleCurrentChange(val) {
      // console.log(this.listQuery)
      // console.log(val);
      this.listQuery.pageIndex = val;
      this.$router.push({
        query: { pageIndex: val }
      });
      this.$emit("PageChange", this.listQuery);
    }
  },
  watch:{
    listQuery:{
      immediate: true,    // 这句重要
      handler (val) {
          // this.newPageIndex = val.pageIndex
          this.newPage = val
      }
    },
    newPageIndex(n){
    }
  },
  mounted() {
    // console.log(this.$route)
    // if()
    // console.log(this.$route.query.pageIndex);
    if (this.$route.query.pageIndex == undefined) {
      //当前url里没有pageIndex
      this.$router.push({
        query: { pageIndex: 1 }
      });
    }else{
      this.newPageIndex = Number(this.$route.query.pageIndex)
      // console.log(this.newPageIndex)
    }
    this.pageSize = Number(localStorage.getItem("totalPage"));
    if (this.pageSize == undefined || this.pageSize == 0) {
      localStorage.setItem("totalPage", 50);
      this.pageSize = 50;
    }
    // console.log(this.pageSize)
    // console.log(this.newPageIndex)
    this.listQuery.pageSize = this.pageSize;
    // if (this.$route.name !== "mytask") {
      // console.log({...this.listQuery,...{pageIndex:this.newPageIndex}})
      let newList = {...this.listQuery,...{pageIndex:this.newPageIndex}}
      // console.log(newList)
      // this.$emit("PageChange", newList);
    // }

    // localStorage.setItem('currentPageName',)
    // localStorage.setItem('currentPageIndex', val);
  }
};
</script>