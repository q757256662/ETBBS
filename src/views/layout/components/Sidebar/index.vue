<template>
  <!-- <el-scrollbar wrapClass="scrollbar-wrapper">
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
    </el-scrollbar> -->
    
  <div classs="wrapper">
    <span class="send_topic">
      <el-button type="primary" @click="handleSubmit">发表主题</el-button>
    </span>
    <div class="siderbar">
      <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" text-color="#6c757d" active-text-color="#5599F9">
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import SidebarItem from './SidebarItem'
  export default {
    components: {
      SidebarItem
    },
    computed: {
      routes() {
        return this.$router.options.routes
      },
    },
    methods:{
      handleSubmit(){
        this.$router.push("/submitTopic/index")
      }
    }
  }
</script>
<style >
  .wrapper{
    /* border:1px solid red; */
    background:black;
  }
  .send_topic{
    /* border:1px solid red; */
    /* display: inline-block; */
    height:50px;
    display: flex;
    justify-content: center;
  }

  .send_topic .el-button{
    width: 100%;
  }
  .siderbar{
    height: 100%;
  }

  /* .el-menu{
    height: 100%;
  } */
</style>