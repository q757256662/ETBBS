<template>
  <div>
    <div class="board-item">
    <div class="title-recent">
      <div class="avatar" :style="{background:topicItem.Color}" @click.stop.prevent="handleCheck">
        <!-- {{topicItem.KeyFileIds.substring(0,1) }} -->
        <svg-icon icon-class="checked" v-if="checkState"></svg-icon>
        <svg-icon icon-class="unchecked" v-else></svg-icon>
      </div>
      <div class="right">
        <h2>
          <p class="title" :title="topicItem.FirstContent">{{topicItem.TopicTitle}}</p>
        </h2>
      </div>
      <div class="icons">
        <span class="mark" title="钉一下" @click.prevent="handleMark({title:item.TopicTitle,topicId:item.TopicId})">
          <svg-icon icon-class="mark" ></svg-icon>
        </span>
        <span title="加急" style="margin-left:5px;">
          <svg-icon icon-class="hot" v-for="item in topicItem.IsHot" :key="item"></svg-icon>
        </span>
        
        <!-- icon专用 TODO -->
      </div>
      <div class="append-icons">
        <!-- icon专用 TODO -->
      </div>
    </div>
    <div class="detail">
      <div class="recent">
        <span class="line" :style="{borderLeft: `4px solid ${topicItem.Color}`}"></span>
        <div class="post">
          <span>
            <p class="topic-info">
            <span class="replyname-class">
                {{topicItem.ReplyName}}
            </span>
            <span class="time">{{topicItem.CollectionTime|formatTime}}</span>
          </p>
          </span>
        </div>
        <div class="time">
          <!-- {{topicItem.Reply.time}} -->
        </div>
      </div>
    </div>
      <DeleteIcon :topicId="topicItem.ReplyId" @getMyCollect="onMyCollect" class="delete-class" deleteType="collection"></DeleteIcon>
  </div>
  </div>
  
</template>
<script>
import { formatTime, delHtmlTag } from "@/utils/index";
import DeleteIcon from "@/components/DeleteIcon";
import { MarkTopic } from "@/api/topic";
import { GetLimitScore } from "@/api/topicList";
export default {
  name: "collectionItem",
  props: {
    item: {
      type: Object,
      default: null
    },
    flashTopic: {
      type: Function,
      default: null
    }
  },
  components: {
    DeleteIcon: DeleteIcon
  },
  data() {
    return {
      colorBox: {
        ULSG打推: "#FB966E",
        ET打推: "rgb(64, 158, 255)",
        Bag打推: "#FF9999",
        排料: "#99CC33",
        绘图仪和切割机: "#FF9900",
        网络睿排: "rgb(239, 191, 0)",
        版本发布: "#FF0033",
        ETPS: "#FF9966",
        ETBRA: "#FF8000",
        裁床: "#FF9966",
        功能操作说明: "#FF9966",
        没有: "#000",
        排料: "#99CC33",
        升级内容: "#00AEAE",
        数字化仪: "#0066CC",
        培训文档: "#8C8C00",
        ICM: "#8080C0",
        PPT: "#804040",
        微信: "#8F4586",
        ET: "#00EC00"
      },
      topicItem: {},
      createUser: "",
      /**当前帖子选择状态 */
      checkState: false
    };
  },
  created() {
    //   this.topicItem = this.handleFormat(this.$props.item);
    this.topicItem = this.$props.item;
    this.createUser = this.$store.state.user.userinfo.name;
  },
  filters:{
      formatTime(val){
          return formatTime(val)
      }
  },
  methods: {
      /**跳转链接 */
      handleRoute(){
    //   this.route.push({path:'/TopicSingle',params:{topicId:topicItem.topicId}});
      // this.$router.push({ path: "/TopicSingle?topicId=" + this.topicItem.TopicId});

      },
    onMyCollect() {
        this.$emit('flashPage')
    }, 
    //标记帖子
    handleMark(item) {
      MarkTopic(item).then(res => {
        if (res.Success) {
          this.$message({
            message: "标记成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.ErrMes,
            type: "warning"
          });
        }
      });
    },
    /**选择帖子 */
    handleCheck() {
      this.checkState = !this.checkState;
      this.$emit("onSettingCollect",this.topicItem,this.checkState)
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.board-item {
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  // background: #fff;
  padding:2px;
 margin-bottom: 6px;
  border-radius: 5px;
  position: relative;
}

.board-item:hover {
  background: #e5effa;
}

.title {
  color: #000;
  font-size: 0.8em;
  margin: 5px 0;
  white-space: nowrap;
  width: 500px;
  /* 不换行 */
  overflow: hidden;
  text-overflow: ellipsis;
  // width: 100%;
  font-weight: 600;
}
.title-recent {
  display: flex;
  // width: 45%;
  height: 100%;
  align-items: center;
  width: 70%;
}
.title-recent .avatar {
  display: block;
  height: 40px;
  min-width: 40px;
  font-size: 20px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  opacity: 0.6;
  position: relative;
  // top: 1px;
}
.title-recent .avatar img {
  // max-height:50px;
  // max-width:50px;
  height: 100%;
  width: 100%;
}
.right {
  // margin-left: 10px;
  width: 100%;
}
.title-recent .right h2 p {
  margin: 5px 0;
  font-size: 16px;
  height:20px;
  line-height: 20px;
}
.title-recent .right .topic-info {
  font-size: 12px;
  width: 400px;
}
.title-recent .right .topic-info .author {
  display: inline-block;
  color: #337ab7;
  width: 70px;
}
.title-recent .right .topic-info .time {
  margin-left: 10px;
  width: 130px;
}
.title-recent .right .keyFiles {
  font-size: 12px;
  margin-left: 10px;
  color: #343a40;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  width: 180px;
}
.detail {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
  width: 200px;
}
.detail .count-block {
  width: 100px;
  text-align: center;
}
.detail .count {
  margin-left: 20px;
  display: inline-block;
  text-align: center;
}
.detail .count .num {
  font-size: 20px;
  color: #aaa;
}
.detail .count .txt {
  font-size: 15px;
  color: #ccc;
  margin-top: 25px;
}
.line {
  // border-left: 4px solid #ccc;
  height: 100%;
  padding-left: 0;
  opacity: 0.6;
}
.detail .recent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 300px;
  height: 100%;
  box-sizing: border-box;
  margin-left: 50px;
}
.recent .post {
  height: 100%;
  width: 350px;
  box-sizing: border-box;
  margin: 0 20px;
  padding: 8px 0;
  font-size: 15px;
}
.recent .post .content {
  font-size: 0.8em;
  color: #aaa;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 2; //显示的行
  width: 300px;
}
.time {
  color: #888;
  font-size: 12px;
  width: 200px; // float: right;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.block {
  height: 10px;
  width: 10px;
  display: inline-block;
  opacity: 0.6;
}
.icons {
  width: 150px;
  display: flex;
  justify-content: space-around;
  margin-left:100px;
}
.delete-class{
    position: relative;
    bottom:15px;
    // right: 10px;
}

.replyname-class{
    display:inline-block;
    width:80px;
}
.mark{

}
</style>
