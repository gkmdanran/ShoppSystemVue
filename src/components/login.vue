<template>
  <div class="login">
    <div class="login_box">
      <div class="pic">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form ref="loginRef" class="login_inform" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginRef.resetFields();
    },
    login() {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status != 200) {
          this.$message({
            duration: 800,
            message: res.meta.msg,
            type: "error"
          });
          this.resetLoginForm();
        } else {
          this.$message({
            duration: 1000,
            message: "登录成功",
            type: "success"
          });
          window.sessionStorage.setItem("token", res.data.token);
          this.$router.push("/home");
        }
      });
    }
  },
  created(){
    console.log(this.$router)
    console.log(this.$route)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .pic {
    position: absolute;
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    img {
      background-color: #eeeeee;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.btns {
  float: right;
}
.login_inform {
  position: absolute;
  bottom: 10px;
  width: 80%;
  margin: 0 10%;
}
</style>
<style >
.el-form-item .el-input__icon {
  font-size: 20px;
}
</style>
