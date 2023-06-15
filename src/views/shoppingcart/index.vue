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
          label="姓名"
          :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
          prop="name"
        >
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>

        <el-form-item
          label="昵称"
          prop="nickname"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input v-model="form.nickname" style="width: 370px" />
        </el-form-item>

        <el-form-item
          v-if="dialogTitle == 'create'"
          label="密码"
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input v-model="form.password" style="width: 370px" />
        </el-form-item>

        <el-form-item v-else label="密码">
          <el-input
            v-model="form.password"
            placeholder="不填不修改密码"
            style="width: 370px"
          />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" style="width: 370px" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.tele" style="width: 370px" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" style="width: 370px" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.sex" style="width: 370px" />
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
      <el-input
        v-model="query.name"
        placeholder="商店名"
        class="handle-input mr10"
      />
      <el-button type="primary" icon="el-icon-search" @click="get"
        >搜索</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-delete"
        class="handle-del"
        @click="handleCreate"
        >新增</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-delete"
        class="handle-del mr10"
        @click="delAllSelection"
        >批量删除</el-button
      >
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
      <el-table-column label="姓名" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <el-image
            class="table-td-thumb"
            :src="`${PIC.pictureurl}${scope.row.avatar}`"
            :preview-src-list="[`${PIC.pictureurl}${scope.row.avatar}`]"
          />
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.tele }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.sex == '0'">男</p>
          <p v-else>女</p>
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
  </div>
</template>

<script>
import { getList } from "@/api/table";
import {
  getUserList,
  updateUserUseful,
  deleteUser,
  addUser,
  updateUser,
} from "@/api/apis/user";
export default {
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
      reflash: false,
      dialogFormVisible: false,
      isRouterAlive: true,
      dialogTitle: "",
      total: 0,
      delList: [],
      multipleSelection: [],
      getUserForm: {
        value: "id",
        name: "",
      },
      form: {
        name: "",
        nickname: "",
        avatar: "",
        tele: "",
        sex: "",
        email: "",
        password: "",
      },
      query: {
        address: "",
        name: "",
        pageIndex: 1,
        pageSize: 10,
      },
      list: null,
      listLoading: true,
    };
  },
  watch: {
    reflash: function (newData, oldData) {
      const self = this;
      getUserList({
        value: self.getUserForm.value,
        name: self.getUserForm.name,
      })
        .then(function (res) {
          self.list = res.data;
          for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].useful == 1) {
              self.list[i].useful = true;
            } else {
              self.list[i].useful = false;
            }
            if (self.list[i].avatar == null) {
              self.list[i].avatar = "avatar/none.jpg";
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
    this.getUser();
  },
  methods: {
    // 获取用户数据表
    getUser() {
      const self = this;
      getUserList({
        value: self.getUserForm.value,
        name: self.getUserForm.name,
      })
        .then(function (res) {
          self.list = res.data;
          for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].useful == 1) {
              self.list[i].useful = true;
            } else {
              self.list[i].useful = false;
            }
            if (self.list[i].avatar == null) {
              self.list[i].avatar = "avatar/none.jpg";
            }
          }
          self.reload();
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
      updateUserUseful({
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
            deleteUser({ ids: str })
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
          deleteUser({
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
      this.form.password = "";
    },
    // 确认新增
    createData() {
      this.dialogFormVisible = false;
      const self = this;
      addUser(self.form)
        .then(function (res) {
          if (res.statusCode == 200) {
            self.reflash = true;
            self.$message({
              type: "info",
              message: "添加成功",
            });
          } else {
            self.$message({
              type: "info",
              message: "添加失败,表单填写不完整",
            });
          }
        })
        .catch(function (error) {});
    },
    // 确认修改
    updateData() {
      this.dialogFormVisible = false;
      if (this.form.useful == true) {
        this.form.useful = 1;
      } else {
        this.form.useful = 0;
      }
      const self = this;
      updateUser(self.form)
        .then(function (res) {
          if (res.statusCode == 200) {
            self.reflash = true;
            self.$message({
              type: "info",
              message: "修改成功",
            });
          } else {
            self.$message({
              type: "info",
              message: "更改失败,未修改数据",
            });
          }
        })
        .catch(function (error) {});
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
