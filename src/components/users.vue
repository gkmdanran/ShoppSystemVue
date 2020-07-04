<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入用户姓名" v-model="queryInfo.query" clearable @clear="getUserList()">   
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      
      <el-table :data="userlist" border stripe max-height="330px">
        <el-table-column type="index" label="序号" width="50px" ></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">       
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>       
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>   
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,3,5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
     
    </el-card>
    
    <div class="add">
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="addDialogClosed"
        >
        <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="70px" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>       
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>  
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="edit">
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editDialogClosed()"
        >
        <el-form :model="editForm" :rules="addRules" ref="editRef" label-width="70px" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>    
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>  
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  
    <div class="roles">
      <el-dialog
        title="分配角色"
        :visible.sync="setRoledialogVisible"
        width="40%"
        @close="setRoledialogClosed()"
        >
        <div>
          <p v-text="'当前的用户：'+userInfo.username"></p>
          <p v-text="'当前的角色：'+userInfo.role_name"></p>
          <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择角色">
              <el-option
                v-for="item in rolesLst"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoledialogVisible= false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    var checkEmail = (rule, value, callback) => {
      const regEmail=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if(regEmail.test(value)){
        return callback()
      }
      return callback(new Error("请输入合法邮箱"))
    };
    
    var checkMobile = (rule, value, callback) => {
      const regMobile=/^1\d{10}$/
      if(regMobile.test(value)){
        return callback()
      }
      return callback(new Error("请输入合法手机号"))
    };
    return {
      addDialogVisible:false,
      editDialogVisible:false,
      setRoledialogVisible:false,
      selectedRoleId:'',
      userInfo:{},
      rolesLst:[],
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editForm:{},
      userlist:[],
      total:0,
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      addRules: {
        username:[
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password:[
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 3, max: 10, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email:[
            { required: true, message: "请输入邮箱", trigger: "blur" },   
            { validator: checkEmail, trigger: 'blur' }    
        ],
        mobile:[
            { required: true, message: "请输入手机号", trigger: "blur" },  
            { validator: checkMobile, trigger: 'blur' }       
        ],
      }
      
    }
  },
  methods:{
    handleSizeChange(val) {
        this.queryInfo.pagesize=val
        this.getUserList()
    },
    handleCurrentChange(val) {
        this.queryInfo.pagenum=val
        this.getUserList()
    },
    async getUserList(){
      const {data:res}=await this.$http.get('users',{params:this.queryInfo})
      if(res.meta.status!==200)
        return this.$message({
            duration: 800,
            message: '获取用户列表失败',
            type: "error"
          });
      this.userlist=res.data.users
      this.total=res.data.total
    },
    async userStateChange(userinfo){
      
      const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status!==200){
        userinfo.mg_state=!userinfo.mg_state
        return this.$message({
              duration: 800,
              message: '更新用户状态失败',
              type: "error"
            });
      }
      this.$message({
              duration: 800,
              message: '更新用户状态成功',
              type: "success"
            });
      
      
       
    },
    addDialogClosed(){
      this.$refs.addRef.resetFields()
    },
    addUser(){
      this.$refs.addRef.validate(async valid=>{
        if(!valid)return
        const {data:res}=await this.$http.post("users",this.addForm)
        if(res.meta.status!==201){
           this.$message({
              duration: 800,
              message: res.meta.msg,
              type: "error"
            });
        }
        else{
          this.$message({
              duration: 800,
              message: "添加用户成功",
              type: "success"
            });
            this.addDialogVisible=false
            this.getUserList()
        }
        
      })
    },
    async showEditDialog(id){
      const {data:res}=await this.$http.get("users/"+id)
      if(res.meta.status!==200){
         return this.$message({
              duration: 800,
              message: '获取用户信息失败',
              type: "error"
            });
      }
      else{
        this.editForm=res.data
        this.editDialogVisible=true
      }
      
      
      
    },
    editDialogClosed(){
       this.$refs.editRef.resetFields()
    },
    editUser(){
      this.$refs.editRef.validate(async valid=>{
        if(!valid)return
        const {data:res}=await this.$http.put("users/"+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(res.meta.status!==200){
          this.$message({
              duration: 800,
              message: "修改失败",
              type: "error"
            });
        }
        else {
          this.editDialogVisible=false
          this.getUserList()
           this.$message({
              duration: 800,
              message: "修改成功",
              type: "success"
            });
        }
      })
    },
    async removeUserById(id){
      
      const confrimResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(confrimResult!=='confirm'){
        this.$message({
            type: 'info',
            duration:800,
            message: '已取消删除'
          });      
      }
      else {
        const {data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status!==200){
           this.$message({
              duration: 800,
              message: res.meta.msg,
              type: "error"
            });
        }
        else{
          this.$message({
              duration: 800,
              message: "删除成功",
              type: "success"
            });
            
            this.getUserList()
            
        }
      }
    },
    async setRole(userinfo){
      this.userInfo=userinfo
      const {data:res}=await this.$http.get("roles")
      if(res.meta.status!=200){
        this.$message({
              duration: 800,
              message: '获取角色列表失败',
              type: "error"
            });
      }
      else{
        this.rolesLst=res.data
        this.setRoledialogVisible=true
      }
      
    },
    async saveRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message({
              duration: 800,
              message: '请选择要分配的角色',
              type: "error"
            });
      }
      const{data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.selectedRoleId
      })
      if(res.meta.status!==200){
         return this.$message({
              duration: 800,
              message: res.meta.msg,
              type: "error"
            });
      }
      this.$message({
              duration: 800,
              message: '更新角色成功',
              type: "success"
            });
      this.getUserList()
      this.setRoledialogVisible=false
    },
    setRoledialogClosed(){
      this.selectedRoleId=''
      this.userInfo={}
    }

  },
  created(){
    this.getUserList()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped >

</style>
<style >
  .users .add .el-dialog,
  .users .edit .el-dialog,
  .users .roles .el-dialog {
    min-width: 384px;
    
}

</style>
