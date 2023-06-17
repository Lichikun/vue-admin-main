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
        <el-form ref="form" :model="form" size="small" label-width="80px">
          <el-form-item
            label="名称"
            :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
            prop="name"
          >
            <el-input v-model="form.name" style="width: 370px" />
          </el-form-item>
          <el-form-item label="分类" prop="category" :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]">
            <el-input v-model="form.category" style="width: 370px" />
          </el-form-item>
          <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请输入价格', trigger: 'blur' }]">
            <el-input v-model="form.price"  style="width: 370px" />
          </el-form-item>
          <el-form-item
          label="照片"
          prop="urlList"
          >
          <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :on-change="handleChange"
              :http-request="uploadFile"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :limit="5"
              :on-exceed="handleExceed"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">不选择上传就不更新头像</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="所属商店">
            <el-select v-model="form.shopId" placeholder="请选择">
              <el-option
                v-for="item in shopMsg"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="form.stock" style="width: 370px" />
          </el-form-item>
          <el-form-item label="购买量">
            <el-input v-model="form.purchaseQuantity" style="width: 370px" />
          </el-form-item>
        
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialogFormVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="dialogTitle === 'create' ? createData() : updateData()"
            >确认</el-button
          >
        </div>
      </el-dialog>
  
      <div class="handle-box">
        <el-select v-model="curshop" placeholder="请选择">
            <el-option
            v-for="item in shopMsg"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
          <el-input v-model="query.name" placeholder="商品名" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
          <el-button
              type="primary"
              icon="el-icon-plus"
              class="handle-del"
              @click="handleCreate"
          >新增</el-button>
          <el-button
              type="danger"
              icon="el-icon-delete"
              class="handle-del"
              @click="delAllSelection"
          >批量删除</el-button>
          <el-button
              type="warning"
              icon="el-icon-refresh-right"
              class="handle-del mr10"
              @click="$router.go(0)"
          >重置</el-button>
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
        <el-table-column label="名称" width="500" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-image v-if="loadComplete"
              class="table-td-thumb"
              :src="scope.row.urlList[0]"
              :preview-src-list="scope.row.urlList"
            />
            <el-image v-else
              class="table-td-thumb"
              :src="url"
            />
          </template>
        </el-table-column>
        <el-table-column label="分类" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属商店" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ getShopName(scope.row.shopId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="购买量" align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.purchaseQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="useful"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.useful"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="turnUseful(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
            />
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
  import { getPictureList,addPicture,uploadPet,uploadGoods} from "@/api/apis/picUrl";
  import {
    getGoodsList,
    getGoodsPage,
    updateGoodsUseful,
    deleteGoods,
    addGoods,
    updateGoods,
  } from "@/api/apis/goods";
  import { mapGetters } from 'vuex'
  export default {
    computed: {
        ...mapGetters([
            'curShop'
        ]),
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
        curshop:"0",
        value:"",
        addGoodsId:"",
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
        getGoodsForm: {
          value: "shop_id",
          name: "",
        },
        form: {
          name: "",
          urlList:[],
          details:"",
          category:"",
          price:"",
          shopId:"",
          useful:"",
          stock:"",
          purchaseQuantity:""
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
      };
    },
    watch: {
    //监测是否刷新
    reflash: function (newData, oldData) {
      const self = this;
      getGoodsPage({
        "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        value: self.getGoodsForm.value,
        name: self.getGoodsForm.name,
      })
        .then(function (res) {
          self.list = res.data.records
          self.total = res.data.total
          for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].useful == 1) {
              self.list[i].useful = true;
            } else {
              self.list[i].useful = false;
            }
            self.getGoodsUrl(self.list[i].id,i)
          }
          self.reload();
          self.reflash = false;
        })
        .catch(function (error) {});
    },
    curshop: function (newData, oldData) {
        if(this.curshop == "0")
            this.getGoodsForm.name = ""
        else
            this.getGoodsForm.name = this.curshop
        this.loadComplete = false
        this.addNum = 0
        this.reflash = true
        },
    addNum: function (newData, oldData) {
      if(this.addNum == this.list.length)
        this.loadComplete = true
    },
    listQuery: {
      handler () { //这是vue的规定写法，当你watch的值发生变化的时候，就会触发这个handler，这是vue内部帮你做的事情
        this.loadComplete = false
        this.addNum = 0
        this.getGoods()
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
      immediate: true //刷新加载  立马触发一次handler
    },
  },
  created() {
    this.fetchData();
    this.getGoods();
    this.getShop()
    console.log("trhis ")
    console.log(this.$route.params.shopId)
    // if(this.$route.params.shopId )
    //     this.curshop = this.$route.params.shopId     
  },
  methods: {
    //获取图片
    getGoodsUrl(id,pos){
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
      getGoodsPage({
        "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
            "value":"name",
            "name":self.query.name
        })
        .then(function(res){
          self.list = res.data.records
          self.total = res.data.total
            for(var i=0;i<self.list.length;i++){
                if(self.list[i].useful == 1)
                    self.list[i].useful = true
                else
                    self.list[i].useful =false
                self.getGoodsUrl(self.list[i].id,i)
            }
            self.reload()
        }).catch(function(error){
        })
    },
    //获取宠物数据表
    getGoods(){
      let self = this
        getGoodsPage({
          "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
            "value":self.getGoodsForm.value,
            "name":self.getGoodsForm.name
        })
        .then(function(res){
          self.list = res.data.records
          self.total = res.data.total
              for(var i=0;i<self.list.length;i++){
                  if(self.list[i].useful == 1)
                      self.list[i].useful = true
                  else
                      self.list[i].useful =false
                  self.getGoodsUrl(self.list[i].id,i)
              }
            self.reload()
        }).catch(function(error){
        })
        .catch(function (error) {});
    },
    // 修改用户启停状态
    turnUseful(row) {
      var flag;
      if (row.useful == true) {
        flag = 1;
      } else {
        flag = 0;
      }
      updateGoodsUseful({
        id: row.id,
        flag: flag,
      })
        .then(function (res) {})
        .catch(function (error) {
          console.log(error);
        });
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
            deleteGoods({ ids: str })
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
    // 行内删除
    handleDelete(index, row) {
      const self = this;
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGoods({
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
      this.dialogTitle = "Edit";
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
        addGoods(self.form)
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
        updateGoods(self.form)
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
          uploadGoods(this.formData).then(response => {
              console.log(response)
              var pList = response.data
              if(self.dialogTitle == 'create')
              {
                addGoods(self.form)
                .then(function (res) {
                  console.log()
                  if (res.statusCode == 200) 
                  {
                    getGoodsList({
                      "value":"name",
                      "name":self.form.name
                    }).then(res => {
                      self.addGoodsId = res.data[0].id
                      for(var k = 0;k<pList.length;k++){
                          addPicture({
                            "belongId":res.data[0].id,
                            "url":"goods/"+pList[k],
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
                updateGoods(self.form)
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
      get() {},
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
  </style>
  