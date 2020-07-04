<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          :closable="false"
          show-icon>
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <el-table :data="manyTabData" border stripe>
              <el-table-column type="expand" width="50">
                <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i"   closable @close="handelClose(i,scope.row)">{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTabData" border stripe>
              <el-table-column type="expand" width="50">
                <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i"   closable @close="handelClose(i,scope.row)">{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
        
      </el-tabs>
    </el-card>

    <div class="add">
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="addDialogClosed">
        <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="edit">
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="addFormRules">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      addForm:{
        attr_name:''
      },
      editForm:{},
      addFormRules:{
        attr_name:[
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
      },
      
     
      addDialogVisible:false,
      editDialogVisible:false,
      manyTabData:[],
      onlyTabData:[],
      cateList:[],
      selectedKeys:[],
      activeName:'many',
    }
  },
  methods:{
    handleTabClick(){
      this.getParamsData()
    },
    async getParamsData(){
      if(this.selectedKeys.length!=3){

        this.selectedKeys=[]
        this.manyTabData=[]
        this.onlyTabData=[]
        return
      }
      const {data:res}=await this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status!==200){
        this.$message({
              duration: 800,
              message: res.meta.msg,
              type: "error"
            });
      }
      else{
        
        
        res.data.forEach(item => {
          item.attr_vals=item.attr_vals?
          item.attr_vals.split(' '):[]
          item.inputVisible=false
          item.inputValue=''
        });
        // console.log(res.data)
        if(this.activeName=="many"){
          this.manyTabData=res.data
        }
        else{
          this.onlyTabData=res.data
        }
      }
    },
    handleChange(){
      this.getParamsData()

    },
    async getCateList(){
      const {data:res}=await this.$http.get('categories')
      if(res.meta.status!==200){
         this.$message({
              duration: 800,
              message: "获取商品分类失败",
              type: "error"
            });
      }
      else{
        this.cateList=res.data
        
      }
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return
        const {data:res}=await this.$http.post(`categories/${this.catId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName,
        })
        if(res.meta.status!==201){
           this.$message({
              duration: 800,
              message: "添加参数失败",
              type: "error"
            });
        }
        else{
          this.$message({
              duration: 800,
              message: "添加参数成功",
              type: "success"
            });
            this.addDialogVisible=false
            this.getParamsData()
        }
      })
    },
    async showEditDialog(attr_id){
      const {data:res}=await this.$http.get(`categories/${this.catId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
      if(res.meta.status!==200){
        this.$message({
              duration: 800,
              message: res.meta.msg,
              type: "error"
            });
      }
      else{
        this.editForm=res.data
        this.editDialogVisible=true
      }
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid)return;
        const {data:res}=await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status!==200){
            this.$message({
              duration: 800,
              message: "修改参数失败",
              type: "error"
            });
        }
        else{
          this.$message({
              duration: 800,
              message: "修改参数成功",
              type: "success"
            });
            this.getParamsData()
            this.editDialogVisible=false
        }

      })
    },
    async removeParams(id){
      const confirmResult=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(confirmResult!=='confirm'){
          this.$message({
              duration: 800,
              message: "已取消删除",
              type: "info"
            });
      }
      else{
      
        const {data:res}=await this.$http.delete(`categories/${this.catId}/attributes/${id}`)
        if(res.meta.status!==200){
          this.$message({
              duration: 800,
              message: "删除参数失败",
              type: "error"
            });
        }
        else{
          this.$message({
              duration: 800,
              message: "删除参数成功",
              type: "success"
            });
          this.getParamsData()
        }
      }
    },
    handleInputConfirm(row){
      if(row.inputValue.trim().length==0){
        row.inputValue=''
        row.inputVisible=false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue=''
      row.inputVisible=false
      this.saveAttrVals(row)
    },
    async saveAttrVals(row){
       const{data:res}=await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!==200)
        return this.$message({
              duration: 800,
              message: "修改参数项失败",
              type: "error"
            });
      this.$message({
              duration: 800,
              message: "修改参数项成功",
              type: "success"
            });
    },
    showInput(val){
     val.inputVisible=true
     this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
     });
    },
    handelClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    }
  },
  created(){
    this.getCateList() 
  },
  computed:{
    isBtnDisabled(){
      if(this.selectedKeys.length!=3)
        return true
      else
        return false
    },
    catId(){
      if(this.selectedKeys.length==3)
        return this.selectedKeys[2]
      else
        return null
    },
    titleText(){
      if(this.activeName=="many"){
        return "动态参数"
      }
      else{
        return "静态属性"
      }
    
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
<style>
  .params .add .el-dialog,
  .params .edit .el-dialog {
    min-width: 384px;
  }
</style>
