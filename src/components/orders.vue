<template>
  <div class="orders">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"  clearable v-model="queryInfo.query" @clear="getOrderList()">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList()" ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column  label="订单编号" prop="order_number"></el-table-column>
        <el-table-column  label="订单价格" prop="order_price"></el-table-column>
        <el-table-column  label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column  label="是否发货" prop="is_send" width="90px">
          <template slot-scope="scope">
             <template>
               {{scope.row.is_send}}
             </template>
          </template>
        </el-table-column>
        <el-table-column  label="下单时间" prop="create_time">
           <template slot-scope="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="130px">
          <template >
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 6]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
    <div class="edit">
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="40%"
        @close="addressDialogClosed"
       >
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="show">
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="40%"
        >
         <el-timeline >
            <el-timeline-item
              v-for="(activity, index) in progressInfo"
              :key="index"
              :timestamp="activity.time">
              {{activity.context}}
            </el-timeline-item>
          </el-timeline>
        
      </el-dialog>
    </div>
  </div>
</template>

<script>
import cityData from '../assets/citydata.js'
export default {
  name: 'orders',
  data () {
    return {
      progressInfo:[],
      addressForm:{
        address1:[],
        address2:''
      },
      addressVisible:false,
      progressVisible:false,
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5,
      },
      orderlist:[],
      total:0,
      addressFormRules:{
        address1:[
           { required: true, message: '请选择省市区/县', trigger: 'change' },
        ],
        address2:[
           { required: true, message: '请填写详细地址', trigger: 'blur' },
        ]
      },
      cityData,
    }
  },
  methods:{
    handleSizeChange(val){
      this.queryInfo.pagesize=val
      this.getOrderList()
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum=val
      this.getOrderList()
    },
    async getOrderList(){
      const {data:res}=await this.$http.get("orders",{params:this.queryInfo})
      console.log(res)
      if(res.meta.status!==200){
        return  this.$message({
              duration: 800,
              message: "获取订单列表失败",
              type: "error"
            });
      }
      this.orderlist=res.data.goods
      this.total=res.data.total
    },
    showBox(){
      this.addressVisible=true
    },
    addressDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox(){
      const{data:res}=await this.$http.get(`/kuaidi/1106975712662`)
      if(res.meta.status!==200){
        return  this.$message({
              duration: 800,
              message: "获取物流进度失败",
              type: "error"
            });
      }
      this.progressInfo=res.data
      this.progressVisible=true
      
    },
   
  },
  created(){
    this.getOrderList()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

</style>
<style>
  
  .orders .edit .el-dialog,
  .orders .show .el-dialog  {
    min-width: 384px;
  }
</style>
