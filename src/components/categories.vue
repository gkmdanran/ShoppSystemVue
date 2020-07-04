<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog()">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="eidtCate(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
    
       <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-card>

    <div class="add">
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="addCateDialogColsed()"
        >
        <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px" >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" >
              <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChange()"
                clearable
                >
              </el-cascader>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate()">确 定</el-button>
        </span>
      </el-dialog>

    </div>

    <div class="edit">
      <el-dialog
        title="编辑分类"
        :visible.sync="editVisible"
        width="30%"
        @close="clearEdit()"
        >      
         <el-form :model="editForm" :rules="addRules" ref="editRef" label-width="100px" >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureEdit()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'categories',
  data () {
    return {
      editForm:{},
      editVisible:false,
      selectedKeys:[],
      cascaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly: true,
        
      },
      parentCateList:[],
      addForm:{
        cat_name:'',
        cat_pid: 0,
        cat_level:0
      },
      addDialogVisible:false,
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5,
      },
      total:0,
      cateList:[],
      columns:[
        {
          label:"分类名称",
          prop:"cat_name", 
          
        },
        {
          label:"是否有效",
          type:"template",
          template:'isok',
          
         
        },
        {
          label:"排序",
          type:"template",
          template:'order',
          
        },
        {
          label:"操作",
          type:"template",
          template:'opt',
           minWidth: '50px',
        }
      ],
      addRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      currentEditIndex:0
    }
  },
  methods:{
    handleSizeChange(val) {
      this.queryInfo.pagesize=val
      this.getCateList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum=val
      this.getCateList()
    },
    async getCateList(){
      const{data:res}=await this.$http.get("categories",{params:this.queryInfo})
      if(res.meta.status!==200){
        return this.$message({
              duration: 800,
              message: '获取商品分类失败',
              type: "error"
            });
      }
      this.cateList=res.data.result
      this.total=res.data.total
    },
    showAddDialog(){
      this.getParentCateList()
      this.addDialogVisible=true
    },
    async getParentCateList(){
      const {data:res}=await this.$http.get("categories",{params:{type:2}})
      if(res.meta.status!==200)
        return this.$message({
              duration: 800,
              message: '获取父级分类失败',
              type: "error"
            });
      this.parentCateList=res.data;
    },
    parentCateChange(){
      if(this.selectedKeys.length>0){
        this.addForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
        this.addForm.cat_level=this.selectedKeys.length
      }
      else{
        this.addForm.cat_pid=0
        this.addForm.cat_level=0
      }
    },
    addCate(){
      this.$refs.addRef.validate(async valid=>{
        if(!valid)return
        const {data:res}=await this.$http.post("categories",this.addForm)
        if(res.meta.status!==201){
          this.$message({
              duration: 800,
              message: '添加分类失败',
              type: "error"
            });
        }
        else{
          this.$message({
              duration: 800,
              message: '添加分类成功',
              type: "success"
            });
          this.getCateList()
          this.addDialogVisible=false
        }
      })
    },
    addCateDialogColsed(){
      this.$refs.addRef.resetFields()
      this.selectedKeys=[]
      this.addForm.cat_pid=0
      this.addForm.cat_level=0
    },
    async eidtCate(row){
      
      const {data:res}=await this.$http.get("categories/"+row.cat_id)
      if(res.meta.status!==200)
        return this.$message({
              duration: 800,
              message: '获取分类信息失败',
              type: "error"
            });
      this.editForm=res.data
      this.currentEditIndex=row.cat_id
      this.editVisible=true
    },
    clearEdit(){
      this.$refs.editRef.resetFields()
    },
    sureEdit(){
      this.$refs.editRef.validate(async valid=>{
        if(!valid)return
        const {data:res}=await this.$http.put(`categories/${this.editForm.cat_id}`,{cat_name:this.editForm.cat_name})
        if(res.meta.status!==200)
           return this.$message({
              duration: 800,
              message: '修改分类信息失败',
              type: "error"
            });
        this.$message({
              duration: 800,
              message: '修改分类信息成功',
              type: "success"
            });
        // this.cateList.forEach(item=>{
        //   this.editNameById(item)
        // })
        this.getCateList()
        this.editVisible=false
      })
    },
    // editNameById(x){
    //   console.log(x.cat_name)
    //   if(x.cat_id==this.currentEditIndex)
    //     x.cat_name=this.editForm.cat_name
    //   if(x.children&&x.children.length!=0){
    //     x.children.forEach(item=>{
          
    //       this.editNameById(item)
    //     })
      
    //   }
    // }
    async deleteCate(row){
      const confirm=await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(confirm=='cancel')
        return this.$message({
              duration: 800,
              message: '已取消删除',
              type: "info"
            });
      const {data:res}=await this.$http.delete("categories/"+row.cat_id)
      if(res.meta.status!==200)
         return this.$message({
              duration: 800,
              message: '删除分类失败',
              type: "error"
            });
        this.$message({
              duration: 800,
              message: '删除分类成功',
              type: "success"
            });
        this.getCateList()
    }
  },
  created(){
    this.getCateList()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped >

</style>
<style >
  .categories .add .el-dialog,
  .categories .edit .el-dialog{
    min-width: 384px;
  }
</style>