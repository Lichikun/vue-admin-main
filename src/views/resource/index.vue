<template>
    <div class="app-container" v-if="loadComolete">
      <!--表单组件-->
      <el-dialog
        append-to-body
        :close-on-click-modal="true"
        :visible.sync="dialogFormVisible"
        :title="dialogTitle"
        width="500px"
      >
        <el-form ref="form" :model="form" size="small" label-width="100px">
          <el-form-item
            label="宠物/商品ID"
            :rules="[{ required: true, message: '请输入ID', trigger: 'blur' }]"
            prop="belongId"
          >
            <el-input v-model="form.belongId" style="width: 370px" />
          </el-form-item>
          <el-form-item label="上传图片">
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
            </el-upload>
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
        <el-select v-model="curOpt" placeholder="请选择" class="handle-del mr10">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
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
              @click="reflash = true"
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
            {{ scope.$index + (listQuery.page-1)*listQuery.limit }}
          </template>
        </el-table-column>
        <el-table-column label="昵称" width="300" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="curOpt == '宠物'">{{ scope.row.type }}</span>
            <span v-else>{{ scope.row.category}}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-image
            class="table-td-thumb"
            :src="`${PIC.pictureurl}${scope.row.url}`"
            :preview-src-list="[`${PIC.pictureurl}${scope.row.url}`]"
          />
          </template>
        </el-table-column>
        <el-table-column label="URL" width="400" align="center">
          <template slot-scope="scope">
            {{ scope.row.url }}
          </template>
        </el-table-column>
        <el-table-column label="STATE" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.state }}
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
  import {pictureurl,deletePicture,addPicture,uploadPet,uploadGoods, getPictureList} from "@/api/apis/picUrl";
  import {getPetList,getPetPage,updatePetUseful,deletePet,addPet,updatePet,getPetFile} from "@/api/apis/pets";  
  import {getGoodsList,getGoodsPage,updateGoodsUseful,deleteGoods,addGoods,updateGoods,getGoodsFile} from "@/api/apis/goods";
  
  export default {
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
        curOpt:"宠物",
        options: [{
          value: '宠物',
          label: '宠物'
        }, {
          value: '商品',
          label: '商品'
        }],
        loadComolete:false,
        imageUrl:"",
        formData: '',
        fileList: [],
        reflash: false,
        dialogFormVisible: false,
        isRouterAlive: true,
        dialogTitle: "",
        total: 10,
        delList: [],
        multipleSelection: [],
        getUserForm: {
          value: "id",
          name: "",
        },
        form: {
            belongId: "",
            url:""
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
        loadNum:0,
      };
    },
    watch: {
      //监测是否刷新
      reflash: function (newData, oldData) {
        const self = this;
        if(this.curOpt == "宠物")
          this.getPet()
        else if(this.curOpt == "商品")
          this.getGoods()
        self.reflash = false
      },
      curOpt: function (newData, oldData) {
        console.log(this.curOpt)
        if(this.curOpt == "宠物")
          this.getPet()
        else if(this.curOpt == "商品")
          this.getGoods()
        
      },
      listQuery: {
        handler () { //这是vue的规定写法，当你watch的值发生变化的时候，就会触发这个handler，这是vue内部帮你做的事情
          if(this.curOpt == "宠物")
          this.getPet()
        else if(this.curOpt == "商品")
          this.getGoods()
        },
        deep: true,  // 可以深度检测到 obj 对象的属性值的变化
        immediate: true //刷新加载  立马触发一次handler
      },
    },
    created() {
      this.fetchData();
      this.getPet();
    },
    methods: {
      //用户名搜索
      search(){
        console.log("search")
        // let self = this
        // getUserPage({
        //   "pageNum":self.listQuery.page,
        //   "pageSize":self.listQuery.limit,
        //       "value":"name",
        //       "name":self.query.name
        //   })
        //   .then(function(res){
        //     console.log(res)
        //     self.list = res.data.records
        //     self.total = res.data.total
        //           for(var i=0;i<self.list.length;i++){
        //               if(self.list[i].useful == 1)
        //                   self.list[i].useful = true
        //               else
        //                   self.list[i].useful =false
        //               if(self.list[i].avatar == null)
        //               self.list[i].avatar = "avatar/none.jpg"
        //           }
        //       self.reload()
        //   }).catch(function(error){
        //   })
      },
      //获取用户数据表
      getPet(){
        let self = this
        getPetFile({
          "pageNum":0,
          "pageSize":10000,
        }).then(res => {
          console.log(res)
          self.total = res.data.length
          getPetFile({
            "pageNum":(self.listQuery.page-1)*self.listQuery.limit,
            "pageSize":self.listQuery.limit,
          }).then(function(res){
              self.list = res.data
              self.loadComolete = true
            }).catch(function(error){
            })
            .catch(function (error) {});
        }).catch(err => {})
      },
      getGoods(){
        let self = this
        getGoodsFile({
          "pageNum":0,
          "pageSize":10000,
        }).then(res => {
          console.log(res)
          self.total = res.data.length
          getGoodsFile({
            "pageNum":(self.listQuery.page-1)*self.listQuery.limit,
            "pageSize":self.listQuery.limit,
          }).then(function(res){
              self.list = res.data
              self.loadComolete = true
            }).catch(function(error){
            })
            .catch(function (error) {});
        }).catch(err => {})
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
        console.log(str)
        if (str != "") {
          this.$confirm("此操作将永久删除这些数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
                deletePicture({ ids: str })
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
        console.log()
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
              deletePicture({ "ids":row.id})
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
        if(this.loadNum != 0 )
          this.submitUpload();
        else{
          self.$message({
            type: "info",
            message: "ID/图片不能为空",
          });
        }
  
      },
      uploadFile(file) {
	        this.formData.append('file', file.file);
	    },
      //上传图片函数
      submitUpload(){
        const self = this
        
	        this.formData = new FormData()
          console.log(this.form.belongId)
          this.$refs.upload.submit();
          if(this.curOpt == "宠物"){
            uploadPet(this.formData).then(response => {
              console.log(response)
              var pList = response.data
              console.log("upload")
              getPictureList({
                "value":"belong_id",
                "name":self.form.belongId
              }).then(res => {
                console.log(res.data.length)
                for(var k = 0;k<pList.length;k++){
                    addPicture({
                      "belongId":self.form.belongId,
                      "url":"pet/"+pList[k],
                      "state":k+res.data.length
                    }).then(res => {
                      self.reflash = true;
                        self.$message({
                        type: "info",
                        message: "添加成功",
                      });
                    }).catch(err => {
                      self.$message({
                        type: "info",
                        message: "添加失败,表单填写不完整",
                      });
                    })
                }
              })
            }).catch(err => {})
            self.reflash = true;
            self.$refs.upload.clearFiles();
          }
          else if(this.curOpt == "商品"){
            uploadGoods(this.formData).then(response => {
              console.log(response)
              var pList = response.data
              console.log("upload")
              getPictureList({
                "value":"belong_id",
                "name":self.form.belongId
              }).then(res => {
                console.log(res.data.length)
                for(var k = 0;k<pList.length;k++){
                    addPicture({
                      "belongId":self.form.belongId,
                      "url":"pet/"+pList[k],
                      "state":k+res.data.length
                    }).then(res => {
                      self.reflash = true;
                        self.$message({
                        type: "info",
                        message: "添加成功",
                      });
                    }).catch(err => {
                      self.$message({
                        type: "info",
                        message: "添加失败,表单填写不完整",
                      });
                    })
                }
              })
            }).catch(err => {})
            self.reflash = true;
            self.$refs.upload.clearFiles();
          }
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
  