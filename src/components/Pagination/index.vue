<template>
  <div class="pagination-container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="listQuery.pageIndex"
      :page-sizes="[10,20,30,50]"
      :page-size="listQuery.pageSize"
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
      default: 0
    },
    listQuery: {
      type: Object
      // required: true
    }
  },
  data() {
    return {
      pageSize: 0,
      newPageIndex:0
    };
  },

  methods: {
    /**一页展示多少条数据 */
    handleSizeChange(val) {
      // console.log(val)
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
    this.listQuery.pageSize = this.pageSize;
    // if (this.$route.name !== "mytask") {
      // console.log({...this.listQuery,...{pageIndex:this.newPageIndex}})
      let newList = {...this.listQuery,...{pageIndex:this.newPageIndex}}
      console.log(newList)
      this.$emit("PageChange", newList);
    // }

    // localStorage.setItem('currentPageName',)
    // localStorage.setItem('currentPageIndex', val);
  }
};
</script>