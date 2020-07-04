<template>
  <div class="add">
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-alert
          title="添加商品信息"
          type="info"
          :closable="false"
          show-icon
          center>
      </el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
     
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules" label-position="top">
        
        <el-tabs :tab-position="'left'"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
               <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item> 
               <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }"
                  @change="handleChange"></el-cascader>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals" >
                  <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers='headerObj'
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor class="appwrapper" v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="btnadd" @click="add">添加商品</el-button>
            
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <div class="pre">
      <el-dialog
        title="图片预览"
        :visible.sync="preDialogVisible"
        width="40%"
        >
        <img :src="previewPath" alt="">
      </el-dialog>

    </div>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  name: 'add',
  data () {
    return {
      activeIndex:'0',
      addForm:{
        goods_cat:[],
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      addFormRules:{
        goods_name:[
           { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price:[
           { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight:[
           { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number:[
           { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat:[
           { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
      },
      cateList:[],
      manyTabData:[],
      onlyTabData:[],
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      previewPath:'',
      preDialogVisible:false
    }
  },
  methods:{
    async getCateList(){
       const{data:res}=await this.$http.get("categories")
       if(res.meta.status!==200){
        return this.$message({
              duration: 800,
              message: '获取商品分类失败',
              type: "error"
            });
      }
      this.cateList=res.data
     
    },
    handleChange(){
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat=''
      }
    },
    beforeTabLeave(activeName,oldActiveName){
      if(oldActiveName=='0'&&this.addForm.goods_cat.length!=3){
        this.$message({
              duration: 800,
              message: '请选择商品分类',
              type: "warning"
            });
        return false
      }
      if(activeName-oldActiveName>1){
        this.$message({
              duration: 800,
              message: '请按步骤执行添加操作',
              type: "warning"
            });
        return false
      }    
    },
    async tabClicked(){
      
      if(this.activeIndex==='1'){
        const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
        if(res.meta.status!==200)
          return this.$message({
              duration: 800,
              message: '获取动态参数失败',
              type: "error"
            });
        res.data.forEach(item => {
          item.attr_vals=item.attr_vals.length==0?[]:item.attr_vals.split(' ')
        });
        this.manyTabData=res.data
        // console.log(this.manyTabData)
      }
      else if(this.activeIndex=='2'){
        const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
        if(res.meta.status!==200)
          return this.$message({
              duration: 800,
              message: '获取静态属性失败',
              type: "error"
            });
        this.onlyTabData=res.data
      }
    },
    handlePreview(file){
      this.previewPath=file.response.data.url
      this.preDialogVisible=true
    },
    handleRemove(file){
      const filePath=file.response.tmp_path
      const i=this.addForm.pics.findIndex(item=>item.pic==filePath)
      this.addForm.pics.splice(i,1)
      
    },
    handleSuccess(response){
      const picInfo={pic:response.data.tmp_path}
      this.addForm.pics.push(picInfo)
      
    },
   add(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$message({
              duration: 800,
              message: '请填写必要的表单',
              type: "error"
            });
        }
        const form=_.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(',')
        
        this.manyTabData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })

        this.onlyTabData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs=this.addForm.attrs
       
        console.log(form)
        const {data:res}=await this.$http.post("goods",form)
        if(res.meta.status!==201){
           return this.$message({
              duration: 800,
              message: res.meta.msg,
              type: "error"
            });
        }
        this.$message({
              duration: 800,
              message: "添加成功",
              type: "sucess"
            });
        this.$router.push('/goods')
      })
     
    }
  },
  created(){
    this.getCateList()
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length===3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.el-checkbox {
  margin: 0 10px 0 0!important;
  
}
.pre img{
  width: 100%;
}
.btnadd {
  margin-top: 15px;
}
</style>
<style >
  .add .pre .el-dialog{
    min-width: 384px;
  }
</style>