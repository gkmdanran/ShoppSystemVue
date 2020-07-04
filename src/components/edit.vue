<template>
  <div class="edit">
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
          title="编辑商品信息"
          type="info"
          :closable="false"
          show-icon
          center>
      </el-alert>
      <el-form ref="editRef" :model="goodsInfo" label-width="100px" :rules="editRules" label-position="top">
        <el-tabs :tab-position="'left'" >
          <el-tab-pane label="基本信息" >
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="goodsInfo.goods_name"></el-input>
              </el-form-item>
               <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="goodsInfo.goods_price" type="number"></el-input>
              </el-form-item> 
               <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="goodsInfo.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="goodsInfo.goods_number" type="number"></el-input>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" >
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers='headerObj'
                :file-list="fileList"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" >
              <el-form-item label="商品介绍" >
                <quill-editor class="appwrapper" v-model="goodsInfo.goods_introduce">
                </quill-editor>
              </el-form-item>
          </el-tab-pane>
        </el-tabs>
        
      </el-form>
      <el-button type="primary" @click="submitEdit()">提交</el-button>
      <el-button type="primary" @click="backGoods()">取消</el-button>
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
export default {
  name: 'edit',
  data () {
    return {
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
     goodsInfo:{},
     goodsId:0,
     editRules:{
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
     },
     fileList:[],
     previewPath:'',
     preDialogVisible:false
    }
  },
  methods:{
    async getEditGood(){
      this.goodsId=this.$route.query.id-0
      const {data:res}=await this.$http.get("goods/"+this.goodsId)
     
      if(res.meta.status!==200) 
         return this.$message({
              duration: 800,
              message: '获取商品信息失败',
              type: "error"
            });
      this.goodsInfo=res.data
     
      this.getFileList()
    },
    getFileList(){
     this.goodsInfo.pics.forEach(item => {
       const x={name:item.pics_id,url:item.pics_big_url}
       this.fileList.push(x)
     });
    },
     handlePreview(file){
      
      this.previewPath=file.url
      this.preDialogVisible=true
    },
    handleRemove(file){
      const filePath=file.url
      const i=this.goodsInfo.pics.findIndex(item=>item.pics_big_url==filePath)
      this.goodsInfo.pics.splice(i,1) 
    },
    handleSuccess(response){
      
      const picInfo={pic:response.data.tmp_path}
      this.goodsInfo.pics.push(picInfo)
      
    },
    submitEdit(){
      this.$refs.editRef.validate(async valid=>{
        if(!valid)
          return this.$message({
              duration: 800,
              message: '请填写完整信息',
              type: "error"
            });
        const{data:res}=await this.$http.put("goods/"+this.goodsInfo.goods_id,this.goodsInfo)
        if(res.meta.status!==200)
          return this.$message({
              duration: 800,
              message: '编辑商品信息失败',
              type: "error"
            });
        this.$message({
            duration: 800,
            message: '编辑商品信息成功',
            type: "success"
          });
        this.$router.push("/goods")
      })
      
    },
    backGoods(){
       this.$router.push("/goods")
    }
  },
  created(){
    this.getEditGood()
  },



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
  .el-alert {
    margin-bottom: 20px;
  }
  .pre img{
  width: 100%;
  }
  .el-button {
    float: right;
    margin-right: 30px;
    margin-bottom: 10px;
  }
</style>
<style >
 .edit .pre .el-dialog{
    min-width: 384px;
  }
</style>
