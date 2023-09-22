<template>
  <div class="app-container" >
    <!--表单组件-->
    <el-dialog
      append-to-body
      :close-on-click-modal="true"
      :visible.sync="dialogFormVisible"
      :title="dialogTitle"
      width="500px"
    >
      <div>
        <span>退货理由：</span>
        <input type="text" v-model="form.reason" style="width: 300px;">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogFormVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="updataOrders(form,-3)"
          >确认退货</el-button
        >
        <el-button
          type="danger"
          v-if="form.state == -2"
          @click="updataOrders(form,2)"
          >拒绝退货</el-button
        >
      </div>
    </el-dialog>
    
    <div class="handle-box">
      <el-select v-model="curState" placeholder="请选择">
            <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <!-- <el-input v-model="query.name" placeholder="订单号" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del"
            @click="delAllSelection"
        >批量删除</el-button> -->
        <!-- <el-button
            type="warning"
            icon="el-icon-refresh-right"
            class="handle-del mr10"
            @click="$router.go(0)"
        >重置</el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
    <el-table-column type="selection" width="45" align="center" />
     <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品名称">
            <span>{{ props.row.itemName }}</span>
          </el-form-item>
          <el-form-item label="商品单价">
            <span>{{ props.row.goodsPrice }}</span>
          </el-form-item>
          <el-form-item label="商品数量">
            <span>{{ props.row.goodsQuantity }}</span>
          </el-form-item>
          <el-form-item label="收件人">
            <span>{{ props.row.address +'  ' +props.row.name}}</span>
          </el-form-item>
          <el-form-item label="商品分类">
            <span>{{ props.row.itemType }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="订单号"
      prop="ordersId"
      width="300" align="center">
    </el-table-column>
    <el-table-column
      label="商品名称"
      width="240px"
      prop="itemName">
    </el-table-column>
    <el-table-column
      label="价格"
      >
      <template slot-scope="props">
        <span>{{ props.row.goodsPrice * props.row.goodsQuantity  }}</span>
        </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="props">
        <span>{{ getLabelByValue(props.row.state)}}</span>
      </template>
    </el-table-column>
     <el-table-column
     width="180px"
      label="生成时间"
      prop="creatTime">
    </el-table-column>
    <el-table-column
     width="180px"
      label="订单备注"
      prop="reason">
    </el-table-column>
    <el-table-column label="操作" width="240px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            :disabled="scope.row.state != 1"
            @click="updataOrders(form,2)"
          >发货</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="checkState(scope.row)"
            @click="handleEdit(scope.row)"
          >审核退货</el-button>
        </template>
      </el-table-column> 
    </el-table>
    <div class="page">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"  />
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import Pagination from '@/components/Pagination/index.vue'
import { getShopList } from "@/api/apis/shop";
import { getPictureList,addPicture,uploadPet} from "@/api/apis/picUrl";
import { getAllOrders,getOrdersById,getOrdersByState,updateOrder } from "@/api/apis/orders";
import {
  getPetList,
  getPetPage,
  updatePetUseful,
  deletePet,
  addPet,
  updatePet,
} from "@/api/apis/pets";
import { mapGetters } from 'vuex'
import { smart } from "@babel/template";
export default {
  computed: {
    },
  components: {
      Pagination,
    },
  inject: ["reload"],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      curState:"10",
      options: [{
          value: '公',
          label: '公'
        }, {
          value: '母',
          label: '母'
        }],
      value:"",
      addPetId:"",
      addPic:false,
      loadNum:0,
      addNum:0,
      url:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      loadComplete:false,
      shopMsg:[],
      imageUrl:"",
      srcList:[],
      formData: '',
      fileList:[],
      reflash: false,
      dialogFormVisible: false,
      isRouterAlive: true,
      dialogTitle: "",
      total: 10,
      delList: [],
      multipleSelection: [],
      getPetForm: {
        value: "shop_id",
        name: "",
      },
      reason:"",
      form: {
        id:"",
        state:"",
        reason:"",
      },
      query: {
        address: "",
        name: "",
        pageIndex: 1,
        pageSize: 10,
      },
      list: null,
      listLoading: true,
      listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        stateOptions: [
        {
          value: '10',
          label: '全部'
        },{
          value: '0',
          label: '待支付'
        }, {
          value: '1',
          label: '待发货'
        }, {
          value: '2',
          label: '待收货'
        },  {
          value: '3',
          label: '待评价'
        }, 
        {
          value: '4',
          label: '已完成'
        }, {
          value: '-1',
          label: '已取消'
        }, {
          value: '-2',
          label: '待退货'
        },{
          value: '-3',
          label: '已退货'
        }],
    };
  },
  watch: {
    //监测是否刷新
    reflash: function (newData, oldData) {
      const self = this;
      if(this.curState == 10){
        getAllOrders({
        "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
      })
        .then(function (res) {
          self.list = res.data
          self.total = res.data.total
          self.reload();
          self.reflash = false;
        })
        .catch(function (error) {});
      }else{
        getOrdersByState({
          "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        "state":self.curState
        })
        .then(function(res){
          self.list = res.data
          self.total = res.data[0].mapNum
          self.reflash = false;
            self.reload()
        }).catch(function(error){
        })
        .catch(function (error) {});

      }
      
    },
    addNum: function (newData, oldData) {
      if(this.addNum == this.list.length)
        this.loadComplete = true
    },
    curState: function (newData, oldData) {
      console.log(this.curState)
      if(this.curState == 10)
        this.getOrders()
      else
        this.getOrdersItmeByState()
        },
    listQuery: {
      handler () { //这是vue的规定写法，当你watch的值发生变化的时候，就会触发这个handler，这是vue内部帮你做的事情
        this.loadComplete = false
        this.addNum = 0
        this.getOrders()
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
      immediate: true //刷新加载  立马触发一次handler
    },
  },
  created() {
    this.fetchData();
    this.getOrders();
    this.getShop()
  },
  methods: {
    checkState(row){
      if(row.state == 1 || row.state == 2 || row.state == -2)
        return false
      else
        return true
    },
    getLabelByValue(value) {
      const option = this.stateOptions.find(option => option.value == value);
      return option ? option.label : '';
    },
    //获取图片
    getPetUrl(id,pos){
      let self = this
      var url= []
      getPictureList({
        "value":"belong_id",
        "name":id
      }).then(res => {
        for(var i=0;i<res.data.length;i++)
          url.push(self.PIC.pictureurl+res.data[i].url)
        self.$set(self.list[pos],"urlList",url)
        self.addNum++
      }).catch(err => {

      })
    },
    //获取商店名
    getShopName(id){
      for(var i = 0;i< this.shopMsg.length ;i++){
        if(id == this.shopMsg[i].id)
          return this.shopMsg[i].name
      }
    },
    //获取商店数据表
    getShop(){
      let self = this
          getShopList({
              "value":"id",
              "name":""
          }).then(function(res){
            self.shopMsg = res.data
            self.shopMsg.push({
                "id":"0",
                "name":"全部商店"
            })
          }).catch(function(error){
            console.log(error)
          })
        
    },
    //宠物名搜索
    search(){
      let self = this
      getOrdersById({
        "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        "name":self.query.name
        })
        .then(function(res){
          self.list = res.data.records
          self.total = res.data.total
        }).catch(function(error){
        })
    },
    //获取订单数据表
    getOrders(){
      let self = this
        getAllOrders({
          "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        })
        .then(function(res){
          self.list = res.data
          self.total = res.data[0].mapNum
            self.reload()
        }).catch(function(error){
        })
        .catch(function (error) {});
    },
    getOrdersItmeByState(){
      let self = this
        getOrdersByState({
          "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        "state":self.curState
        })
        .then(function(res){
          self.list = res.data
          self.total = res.data[0].mapNum
            self.reload()
        }).catch(function(error){
        })
        .catch(function (error) {});
    },
    getOrdersItemById(){
      let self = this
        getOrdersById({
          "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        "ordersId":self.query.name
        })
        .then(function(res){
          self.list = res.data
          self.total = res.data[0].mapNum
            self.reload()
        }).catch(function(error){
        })
        .catch(function (error) {});
    },
    // 处理多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除多选内容
    delAllSelection() {
      const self = this;
      const length = this.multipleSelection.length;
      let str = "";
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ",";
      }
      if (str != "") {
        this.$confirm("此操作将永久删除这些数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deletePet({ ids: str })
              .then(function (res) {
                self.reflash = true;
              })
              .catch(function (error) {
                console.log(error);
              });
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message({
          type: "info",
          message: "未选中数据",
        });
      }
    },
    updataOrders(form,state){
      let self = this
      updateOrder({
        "id":form.ordersId,
        "state":state,
        "reason":self.reason
      }).then(res =>{
        self.reflash = true;
        self.$message({
          message: '操作成功',
          type: 'success'
        });
        self.dialogFormVisible = false;
      }).catch(err =>{
        this.$message({
          message: '操作失败',
          type: 'warning'
        });
        self.dialogFormVisible = false;
      })
    },
    // 行内删除
    handleDelete(index, row) {
      const self = this;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePet({
            ids: row.id,
          })
            .then(function (res) {
              self.reflash = true;
            })
            .catch(function (error) {
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 处理新增
    handleCreate() {
      console.log("create")
      this.dialogTitle = "create";
      this.dialogFormVisible = true;
      this.form = Object.assign({});
    },
    // 处理修改
    handleEdit(row) {
      this.dialogTitle = "审核退货";
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row); // copy obj
    },
    // 确认新增
    createData(){
      const self = this;
      this.dialogFormVisible = false;
      if(this.loadNum != 0)
          this.submitUpload()
      else{
        addPet(self.form)
              .then(function (res) {
                if (res.statusCode == 200) 
                {
                  console.log(res)
                  self.reflash = true;
                  self.$message({
                    type: "info",
                    message: "添加成功",
                  });
                  self.$refs.upload.clearFiles();
                  self.loadNum = 0
                } else {
                  self.$refs.upload.clearFiles();
                  self.loadNum = 0
                  self.$message({
                    type: "info",
                    message: "添加失败,表单填写不完整",
                  });
                }
              })
              .catch(function (error) {});
      }
    },
    // 确认修改
    updateData() {
      const self = this;
      this.dialogFormVisible = false;
      if (this.form.useful == true) {
        this.form.useful = 1;
      } else {
        this.form.useful = 0;
      }
      if(this.loadNum != 0)
        this.submitUpload()
      else{
        updatePet(self.form)
              .then(function (res) {
                if (res.statusCode == 200) {
                  self.reflash = true;
                  self.$refs.upload.clearFiles();
                  self.loadNum = 0
                  self.$message({
                    type: "info",
                    message: "修改成功",
                  });
                } else {
                  self.$refs.upload.clearFiles();
                  self.loadNum = 0
                  self.$message({
                    type: "info",
                    message: "更改失败,未修改数据",
                  });
                }
              })
              .catch(function (error) {});
      }

    },
    uploadFile(file) {
	        this.formData.append('file', file.file);
	  },
    submitUpload() {
      const self = this
        console.log("upload")
	        this.formData = new FormData()
          this.$refs.upload.submit();
          uploadPet(this.formData).then(response => {
              console.log(response)
              var pList = response.data
              if(self.dialogTitle == 'create')
              {
                addPet(self.form)
                .then(function (res) {
                  console.log()
                  if (res.statusCode == 200) 
                  {
                    getPetList({
                      "value":"name",
                      "name":self.form.name
                    }).then(res => {
                      self.addPetId = res.data[0].id
                      for(var k = 0;k<pList.length;k++){
                          addPicture({
                            "belongId":res.data[0].id,
                            "url":"pet/"+pList[k],
                            "state":k
                          }).then(res => {
                          }).catch(err => {})
                          self.$message({
                            type: "info",
                            message: "添加成功",
                          });
                      }
                    }).catch(err => {})
                    self.reflash = true;
                    self.$refs.upload.clearFiles();
                  } else {
                    self.$refs.upload.clearFiles();
                    self.$message({
                      type: "info",
                      message: "添加失败,表单填写不完整",
                    });
                  }
                })
                .catch(function (error) {});
              }else if(self.dialogTitle == 'edit'){
                updatePet(self.form)
                .then(function (res) {
                  if (res.statusCode == 200) {
                    self.reflash = true;
                    self.$refs.upload.clearFiles();
                    self.$message({
                      type: "info",
                      message: "修改成功",
                    });
                  } else {
                    self.$refs.upload.clearFiles();
                    self.$message({
                      type: "info",
                      message: "更改失败,未修改数据",
                    });
                  }
                })
                .catch(function (error) {});
              }
          }).catch(err => {
              console.log(err)
          })
	      	this.$refs.upload.clearFiles();
	  },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      console.log(files)
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length } 个文件`);
    },
    handleChange(){
        this.loadNum++
    },
    //其他
    get() {
      console.log(this.listQuery)
    },
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.listLoading = false;
      });
    },
  },
};
</script>
<style>
.handle-box {
  margin-bottom: 20px;
}
.handle-select {
  width: 120px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
