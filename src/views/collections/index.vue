<template>
  <!-- 我的收藏 mycollections -->
  <div class="collect">
    <div class="setting-box">
      <el-button type="danger" @click="handleBatchDelete">删除</el-button>
      <el-button type="warning" @click="handleSettingHot">设为/撤销加急</el-button>
    </div>
    <!-- <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :border="true" style="width: 100%" @row-click="handleSelectionChange" @selection-change="onSelectionChange">
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column prop="TopicTitle" align="center" label="标题" show-overflow-tooltip class-name="can_select">
                <template slot-scope="scope">
                    <div>
                        <span>
                            {{scope.row.TopicTitle}}
                        </span>
                        <span v-if="!scope.row.IsHot==0" title="加急状态">
                            <svg-icon icon-class="hot" v-for="(i,index) in scope.row.IsHot" :key="index"></svg-icon>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="ReplyName" align="center" width="200px;" label="回复人">
            </el-table-column>
            <el-table-column align="center"  label="最新回复日期">
                <template slot-scope="scope">{{ scope.row.CollectionTime |formatTime }}</template>
            </el-table-column>
            <el-table-column align="center" width="200px;" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
    </el-table>-->

    <collectionItem
      v-for="(item,index) in tableData"
      :key="item.ReplyId+item.IsHot"
      :item="item"
      :background="index"
      @flashPage="getMyCollect"
      @onSettingCollect="handleSettingCollect"
      :class="{'collection-class':true,'border-striped':index%2==0}"
    ></collectionItem>
    <noItem v-if="tableData.length==0" v-loading="loadingState"></noItem>
    <!-- <el-pagination
      class="page"
      layout="total,sizes,prev, pager, next"
      :current-page="queryList.pageIndex"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :page-sizes="[10, 20, 30, 50]"
      :total="total"
    ></el-pagination> -->
    <Pagination :total="total" @PageChange="getMyCollect" :listQuery="queryList" class="page">

    </Pagination>

  </div>
</template>
<script>
import { getList, deleteColletion, setHot } from "@/api/mycollections.js";
import collectionItem from "@/components/TopicItem/collectionItem.vue";
import noItem from "@/components/NoItem";
import { formatTime, delHtmlTag } from "@/utils/index";
import Pagination from '@/components/Pagination'

export default {
  components: {
    collectionItem,
    noItem,
    Pagination
  },
  data() {
    return {
      tableData: [], //列表
      total: 0, //总条数
      queryList: {
        pageSize: 10, //当前页数
        pageIndex: 1 //一页显示的条数
      },
      selectionArray: [], //选中的列
      loadingState: false
    };
  },
  created() {
    // this.getMyCollect();
  },
  filters: {
    formatTime(str) {
      return formatTime(str, false);
    }
  },
  methods: {
    /**选择帖子 */
    handleSettingCollect(row, state) {
      // console.log(arguments)
      if (state) {
        this.selectionArray.push(row);
      } else {
        this.selectionArray = this.selectionArray.filter(el => {
          return el.TopicId != row.TopicId;
        });
      }
    },
    getMyCollect() {
      this.loadingState = true;
      getList(this.queryList).then(res => {
        this.loadingState = false;
        if (res.Success == true) {
          this.selectionArray.splice(0);
          this.tableData = res.Data.Rows;
          this.total = res.Data.Total;
        }
      });
    },
    handleEdit(index, row) {
      // console.log(index, row);
    },
    /**移除收藏 */
    handleDelete(index, row) {
      let ReplyIds = [row.ReplyId];
      deleteColletion(ReplyIds).then(res => {
        if (res.Success) {
          this.$message.success("移除成功");
          this.getMyCollect();
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    /**批量移除收藏 */
    handleBatchDelete() {
      let ReplyIds = this.selectionArray.map(item => item.ReplyId);
      deleteColletion(ReplyIds).then(res => {
        if (res.Success) {
          this.$message.success("移除成功");
          this.getMyCollect();
        } else {
          this.$message.warning(res.ErrMes);
        }
      });
    },
    /**查看是否被选中 */
    onSelectionChange(row) {
      this.selectionArray = row;
    },
    // 设为/撤销加急
    handleSettingHot() {
      if (this.selectionArray.length != 0) {
        // console.log(this.selectionArray)
        let result = this.selectionArray.every(el => {
          // console.log(el.IsHot)
          // console.log(this.selectionArray[0].IsHot)
          return el.IsHot == this.selectionArray[0].IsHot;
        });
        if (result) {
          let obj = {};
          obj.TopicIds = this.selectionArray
            .map(el => el.TopicId)
            .filter((element, index, self) => self.indexOf(element) === index);
          obj.Hot =
            this.selectionArray[0].IsHot == 2 ? (obj.Hot = 0) : (obj.Hot = 2);
          // console.log(obj)
          setHot(obj).then(res => {
            if (res.Success) {
              this.$message.success("设置成功");
              this.getMyCollect();
            } else {
              this.$message.warning(res.ErrMes);
            }
          });
        } else {
          this.$message.warning("帖子加急状态不一致");
        }
        // setHot()
      }
    },
    handleSelectionChange(row, column, event) {
      // console.log(event);
      if (event.property == "TopicTitle") {
        this.$router.push({ path: "/TopicSingle?topicId=" + row.TopicId });
      }
      // this.route.push({path:'/TopicSingle',params:{topicId:row.topicId}});
    },

    handlePageChange(page) {
      this.queryList.pageIndex = page;
      this.getMyCollect();
    },
    handleSizeChange(val) {
      this.queryList.pageSize = val;
      this.queryList.pageIndex = 1;
      this.getMyCollect();
    }
  }
};
</script>
<style>
.collect {
  background: #f6f6f6;
  margin-bottom: 15px;
}
.can_select {
  cursor: pointer;
}

.setting-box {
  height: 80px;
  line-height: 60px;
  padding: 10px;
  margin-bottom: 20px;
  background: #eee;
}
.collection-class {
  display: block;
  cursor: pointer;
  background: #fff;
  width: 100%;
  z-index: 1000;
  
}
.border-striped{
  background: #ededed;

}
</style>
