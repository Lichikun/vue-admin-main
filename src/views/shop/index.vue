<template>
  <div class="app-container">
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
          label="店名"
          :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
          prop="name"
        >
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>

        <el-form-item label="店铺图片">
          <el-upload
            class="upload-userAvatar"
            ref="upload"
            action="#"
            :http-request="uploadImage"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit="1"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">不选择上传就不更新头像</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.tele" style="width: 370px" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" style="width: 370px" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="form.description" style="width: 370px" />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="form.latitude" style="width: 370px" />
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="form.longitude" style="width: 370px" />
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
        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
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
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="店名" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺图片" align="center">
        <template slot-scope="scope">
          <el-image
            class="table-td-thumb"
            :src="`${PIC.pictureurl}${scope.row.picture}`"
            :preview-src-list="[`${PIC.pictureurl}${scope.row.picture}`]"
          />
        </template>
      </el-table-column>
      <el-table-column label="地址" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="介绍" align="center">
          <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.tele }}
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.latitude }}
        </template>
      </el-table-column>
      <el-table-column label="经度" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.longitude }}
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
import { uploadShop } from "@/api/apis/picUrl";
import {
  getShopList,
  getShopPage,
  updateShopUseful,
  deleteShop,
  addShop,
  updateShop,
} from "@/api/apis/shop";
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
      loadNum:0,
      imageUrl:"",
      reflash: false,
      dialogFormVisible: false,
      isRouterAlive: true,
      dialogTitle: "",
      total: 10,
      delList: [],
      fileList:[],
      multipleSelection: [],
      getShopForm: {
        value: "id",
        name: "",
      },
      form: {
        name: "",
        address: "",
        tele: "",
        picture:"",
        desc: "",
        longitude: "",
        latitude: "",
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
      getShopPage({
        "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        value: self.getShopForm.value,
        name: self.getShopForm.name,
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
          }
          self.reload();
          self.reflash = false;
        })
        .catch(function (error) {});
    },
  },
  created() {
    this.fetchData();
    this.getShop();
  },
  methods: {
    //用户名搜索
    search(){
      let self = this
      getShopPage({
        "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
            "value":"name",
            "name":self.query.name
        })
        .then(function(res){
          console.log(res)
          self.list = res.data.records
          self.total = res.data.total
                for(var i=0;i<self.list.length;i++){
                    if(self.list[i].useful == 1)
                        self.list[i].useful = true
                    else
                        self.list[i].useful =false
                }
            self.reload()
        }).catch(function(error){
        })
    },
    //获取用户数据表
    getShop(){
      let self = this
        getShopPage({
          "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
            "value":self.getShopForm.value,
            "name":self.getShopForm.name
        })
        .then(function(res){
          console.log(res)
          self.list = res.data.records
          self.total = res.data.total
                for(var i=0;i<self.list.length;i++){
                    if(self.list[i].useful == 1)
                        self.list[i].useful = true
                    else
                        self.list[i].useful =false
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
      updateShopUseful({
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
            deleteShop({ ids: str })
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
          deleteShop({
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
        this.$refs.upload.submit();
      else{
        addShop(self.form)
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
        this.$refs.upload.submit();
      else{
        updateShop(self.form)
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
    //上传图片函数
    uploadImage(param){
        const self = this;
        console.log("upload")
        const formData = new FormData()
        formData.append('file', param.file)
        uploadShop(formData).then(response => {
            if(self.dialogTitle == 'create')
            {
              addShop(self.form)
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
                } else {
                  self.$refs.upload.clearFiles();
                  self.$message({
                    type: "info",
                    message: "添加失败,表单填写不完整",
                  });
                }
              })
              .catch(function (error) {});
            }else{
              updateShop(self.form)
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
            console.log(response)
            self.form.picture = "shop/"+response.data
        }).catch(response => {
            console.log('图片上传失败')
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      console.log(files)
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length } 个文件`);
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
