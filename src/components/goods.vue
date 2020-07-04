<template>
  <div class="goods">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
           <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
          
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="goAddpage()">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe >
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" show-overflow-tooltip ></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope" >
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row)"></el-button>       
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>

    <!-- <div class="edit">
      <el-dialog
        title="提示"
        :visible.sync="editVisible"
        width="40%"
        >
        <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price" type="number"></el-input>
          </el-form-item>
           <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight" type="number"></el-input>
          </el-form-item>
           <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍" prop="goods_introduce">
            <div v-html="editForm.goods_introduce"></div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'goods',
  data () {
    return {
      editVisible:false,
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:8, 
      },
      goodsList:[],
      total:0,
      
    }
  },
  methods:{
    handleSizeChange(val){
      this.queryInfo.pagesize=val
      this.getGoodsList()
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum=val
      this.getGoodsList()
    },
    async getGoodsList(){
      const{data:res}=await this.$http.get("goods",{params:this.queryInfo})
      if(res.meta.status!==200)
        return  this.$message({
              duration: 800,
              message: "获取商品列表失败",
              type: "error"
            });
      this.goodsList=res.data.goods
      this.total=res.data.total
    },
    async removeById(id){
      const confirmResult=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=="confirm"){
          return this.$message({
              duration: 800,
              message: "已取消删除",
              type: "info"
            });
        }
        const {data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200)
          return this.$message({
              duration: 800,
              message: "删除失败",
              type: "error"
            });
        this.$message({
              duration: 800,
              message: "删除成功",
              type: "success"
            });
        this.getGoodsList()
    },
    goAddpage(){
      this.$router.push('/goods/add')
    },
    async showEdit(row){
     
      this.$router.push({
        path:"/goods/edit",
        query:{
          id:row.goods_id
        }
      })
    }
  },
  created(){
    this.getGoodsList()
  },
 

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

</style>
<style>
  .goods .edit .el-dialog  {
    min-width: 384px;
  }
</style>
