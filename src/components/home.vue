<template>
  <div class="home">
    <el-container class="home_container">
      <el-header>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
        <el-button type="info" @click="logout()">退出</el-button>
      </el-header>
      <el-container class="content">
        <el-aside :width="isCollapse?'64px':'220px'">
          <div class="toggle-button" @click="toggleCollapse()" >
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
          </div>
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff"
           :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router :default-active="activeNav">
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span v-text="item.authName"></span>
              </template>
              <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" >
                <i class="el-icon-menu"></i>
                <span v-text="subitem.authName"></span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menulist:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'

      },
      isCollapse:false,
      activeNav:''
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message({
        duration: 800,
        message: "退出成功",
        type: "success"
      });
    },
    async getMenuList(){
      const {data:res}=await this.$http.get('menus')
      if(res.meta.status!==200)
        return this.$message({
            duration: 800,
            message: res.meta.msg,
            type: "error"
          });
      this.menulist=res.data
    },
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    saveNavState(){
      
      this.activeNav=this.$route.path
    }
  },
  created(){
    this.getMenuList()
    this.saveNavState()
  },
  watch:{
    '$route':function(){
       this.activeNav=this.$route.path
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped >
.home {
  width: 100%;
  height: 100%;
}
.home_container {
  width: 100%;
  height: 100%;
}
.content {
  height: calc(100% - 60px);
}
.el-header {
  background-color: #373d41;
  line-height: 60px;
  img {
    width: 40px;
    height: 40px;
    float: left;
    margin-top: 10px;
    margin-right: 20px;
  }
  .el-button {
    float: right;
    margin-top: 10px;
  }
  span {
    color: #ffffff;
    font-size: 20px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
  .toggle-button {
    
    height: 24px;
    background-color: #4a5064;
    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
  }
}
.el-main {
 
  background-color: #eaedf1;
  padding-bottom: 0;
 
}
.iconfont {
  margin-right: 10px;
}
</style>
