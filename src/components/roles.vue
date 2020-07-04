<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addShow()">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolselist" border stripe>
        <el-table-column type="expand"  width="50px">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1===0?'bdtop':'','vcenter']">
              <el-col :span="5">
                 <el-tag  closable @close="removeRgihtById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                  <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0?'':'bdtop','vcenter']">
                    <el-col :span="6">
                      <el-tag  type="success" closable @close="removeRgihtById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="(item3) in item2.children" :key="item3.id"  closable type="warning" @close="removeRgihtById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row)">删除</el-button>
             <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
   

    <div class="set">
      <el-dialog
        title="分配权限"
        :visible.sync="setRightdialogVisible"
        width="40%"
        @close="setRightDialogClosed()"
        >
        <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    
    <div class="add">
      <el-dialog
        title="新增角色"
        :visible.sync="addVisible"
        width="40%"
        @close="clearAdd"
        >
        <el-form ref="addRoleRef" :model="addRoleFrom" label-width="80px" :rules="addRoleRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleFrom.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="edit">
      <el-dialog
        title="修改角色"
        :visible.sync="editVisible"
        width="40%"
        @close="clearEdit"
        >
        <el-form ref="editRoleRef" :model="editRoleFrom" label-width="80px" :rules="addRoleRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleFrom.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  
  </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      rolselist:[],
      rightslist:[],
      setRightdialogVisible:false,
      addVisible:false,
      editVisible:false,
      addRoleFrom:{
        roleName:'',
        roleDesc:''
      },
      editRoleFrom:{},
      addRoleRules:{
        roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc:[
            { min: 0, max: 10, message: '长度在 20字以内', trigger: 'blur' }
        ]
      },
      treeProps: {
          children: 'children',
          label: 'authName'
      },
      defKeys:[],
      roleId:'',
    }
  },
  methods:{
    async getRolesList(){
     const {data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message({
            duration: 800,
            message: '获取角色列表失败',
            type: "error"
          });
      }
      else{
        this.rolselist=res.data
        
      }

    },
    async removeRgihtById(role,rightId){
      const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(confirmResult!=='confirm'){
         this.$message({
            type: 'info',
            duration:800,
            message: '已取消删除'
          });      
      }
      else{
        const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
          return this.$message({
            duration: 800,
            message: res.meta.msg,
            type: "error"
          });
        }
        else{
          role.children=res.data
          this.$message({
            duration: 800,
            message: "删除成功",
            type: "success"
          });
        }
      }
    },
    async showSetRightDialog(role){
      this.roleId=role.id
      const {data:res}=await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        return this.$message({
            duration: 800,
            message: '获取权限列表失败',
            type: "error"
          });
      }
      else {
        
        this.rightslist=res.data
        this.getLeafKeys(role,this.defKeys)
        this.setRightdialogVisible=true
      }
    },
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    setRightDialogClosed(){
      this.defKeys=[]
    },
    async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!=200){
         this.$message({
            duration: 800,
            message: '更新权限失败',
            type: "error"
          });
      }
      else{
        this.$message({
            duration: 800,
            message: '更新成功',
            type: "success"
          });
        this.getRolesList()
        this.setRightdialogVisible=false
      }
    },
    addShow(){
      this.addVisible=true
    },
    clearAdd(){
      this.$refs.addRoleRef.resetFields()
    },
    clearEdit(){
      this.$refs.editRoleRef.resetFields()
    },
    addRole(){
      this.$refs.addRoleRef.validate(async valid =>{
        if(!valid)return
        const {data:res}=await this.$http.post("roles",this.addRoleFrom)
        if(res.meta.status!==201)
          return this.$message({
              duration: 800,
              message: '添加角色失败',
              type: "error"
            });
        this.$message({
              duration: 800,
              message: '添加角色成功',
              type: "success"
            });
        this.getRolesList()
        this.addVisible=false
      })
    },
    async showEdit(row){
      const {data:res}=await this.$http.get("roles/"+row.id)
      
      if(res.meta.status!==200)
        return this.$message({
            duration: 800,
            message: res.meta.msg,
            type: "error"
        });
      this.editRoleFrom=res.data
      this.editVisible=true
    },
    editRole(){
      this.$refs.editRoleRef.validate(async valid=>{
        if(!valid)return 
        
        const {data:res}=await this.$http.put(`roles/${this.editRoleFrom.roleId}`,{
          roleName:this.editRoleFrom.roleName,
          roleDesc:this.editRoleFrom.roleDesc==''?' ':this.editRoleFrom.roleDesc
          })
        
        if(res.meta.status!==200)
          return this.$message({
            duration: 800,
            message: res.meta.msg,
            type: "error"
          });
        this.$message({
            duration: 800,
            message: "编辑角色成功",
            type: "success"
          });
        this.getRolesList()
        this.editVisible=false
      })
    },
    deleteRole(row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res}=await this.$http.delete("roles/"+row.id)
          if(res.meta.status!==200)
            return  this.$message({
                type: 'error',
                duration: 800,
                message: '删除角色失败'
              });     
             this.$message({
                type: 'success',
                duration: 800,
                message: '删除角色成功'
              });  
            this.getRolesList()   
        }).catch(() => {
          this.$message({
            type: 'info',
            duration: 800,
            message: '已取消删除'
          });          
        });
    }
  },
  created(){
    this.getRolesList()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.el-tag {
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
<style >
  .roles .set .el-dialog,
  .roles .add .el-dialog,
  .roles .edit .el-dialog {
    min-width: 384px;
    
}

</style>

