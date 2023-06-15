<template>
    <div class="app-container">
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="true"  :visible.sync="dialogFormVisible" :title="dialogTitle" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogTitle==='create'?createData():updateData()">确认</el-button>
        </div>
      </el-dialog>

      <el-row :gutter="10">
        <el-col  :xs="24" :sm="24" :md="14" :lg="13" :xl="13" style="margin-bottom: 10px">
          <el-card class="box-card">
            <!--工具栏-->
            <div class="head-container">
              <div style="margin-bottom: 15px;">
                <!-- 搜索 -->
                <el-input v-model="searchInput" clearable size="small" placeholder="输入名称或者描述搜索" style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="get(keyin)" />
                <!-- <rrOperation /> -->
                <span>
                  <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="search()">搜索</el-button>
                  <el-button v-if="true" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="$router.go(0)">重置</el-button>
                </span>
              </div>
              <!-- <crudOperation :permission="permission" /> -->
              <div class="buttons">
                  <el-button
                  v-if="true"
                  class="filter-item"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="handleCreate()"
                >
                  新增
                </el-button>
                <el-button
                  v-if="true"
                  class="filter-item"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="delAllSelection"
                >
                  批量删除
                </el-button>
                <el-button
                  v-if="true"
                  class="filter-item"
                  size="mini"
                  type="warning"
                  icon="el-icon-download"
                  @click="get()"
                >
                  导出
                </el-button>
              </div>
            </div>
            <!--表格渲染-->
            <el-table ref="table"  :data="list" highlight-current-row style="width: 100%;" @selection-change.stop="handleSelectionChange" @current-change="handleCurrentChange">
              <el-table-column type="selection" width="55px" />
              <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
              <el-table-column :show-overflow-tooltip="true" prop="value" label="描述" />
              <el-table-column  label="操作" width="130px" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click.stop="handleEdit(scope.row)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click.stop="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <div class="page">
              <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"  />
            </div>
            
          </el-card>
        </el-col>
        <!-- 字典详情列表 -->
        <el-col :xs="24" :sm="24" :md="10" :lg="11" :xl="11">
          <el-card class="box-card">
            
            <dictDetail v-if="isRouterAlive"></dictDetail>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import dictDetail from './dictDetail.vue'
  import Pagination from '@/components/Pagination/index.vue'
  import { mapMutations } from 'vuex'


  import { addDictype, deleteDictype, updateDictype, getDictypeList, getDictypePage } from '@/api/apis/dictype';

  export default {
    inject:["reload"],
    name: 'Dict',
    components: {
      Pagination,
      dictDetail,
    },
    data() {
      return {
        isRouterAlive: true,
        reflash:false,
        total:0,
        searchInput:"",
        dialogTitle:"",
        dialogFormVisible:false,
        form:{
          name:"",
          value:""
        },
        delList: [],
        multipleSelection: [],
        table:[],
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        list:[],
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        tableData: [],
      }
    },
    created(){
      this.getDictype()
    },
    watch:{
      //监测是否刷新
      reflash:function(newData, oldData) {
          let self = this
          getDictypePage({
            "pageNum":self.listQuery.page,
          "pageSize":self.listQuery.limit,
            "value":"name",
            "name":""
          })
          .then(function(res){
              self.total = res.data.total
              self.list = res.data.records
              self.reflash = false
          }).catch(function(error){
          })
      },
    },
    methods: {
      //获取vuex字段
      ...mapMutations("pageSettings",["CHANGE_SETTING"]),
      //dictype搜索
      search(){
        let self = this
        getDictypePage({
          "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
              "value":"name",
              "name":self.searchInput
          })
          .then(function(res){
              self.total = res.data.total
              self.list = res.data.records
              self.reflash = true
              self.reload()
          }).catch(function(error){
          })
      },
      //获取用户数据表
      getDictype(){
        let self = this
          getDictypePage({
            "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
              "value":"name",
              "name":""
          })
          .then(function(res){
              self.total = res.data.total
              self.list = res.data.records
              console.log(res)
              self.reflash = true
              self.reload()
          }).catch(function(error){
          })
      },
      //处理多选
      handleSelectionChange(val) {
              this.multipleSelection = val;
      },
      //删除多选内容
      delAllSelection(){
        let self = this
        const length = this.multipleSelection.length;
        let str = '';
        this.delList = this.delList.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
            str += this.multipleSelection[i].id + ',';
        }
        if(str != ""){
          this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              deleteDictype({"ids":str})
              .then(function(res){
                  self.reflash = true
              }).catch(function(error){
                  console.log(error)
              })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        }else{
          this.$message({
              type: 'info',
              message: '未选中数据'
            });      
        }
        
      },
      //行内删除
      handleDelete(index, row){
        let self = this
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
            deleteDictype({
                "ids":row.id,
            }).then(function(res){
              self.reflash = true
            }).catch(function(error){
                console.log(error)
            })
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        }).catch(() => {
        this.$message({
            type: 'info',
            message: '已取消删除'
        });          
        });
      },
      //新建字段
      handleCreate() {
        this.dialogTitle = 'create'
        this.dialogFormVisible = true
        this.form = Object.assign({}) // copy obj
      },
      //编辑字段
      handleEdit(row) {
        this.dialogTitle = 'Edit'
        this.dialogFormVisible = true
        this.form = Object.assign({}, row) // copy obj
      },
      //选中更改dictname
      handleCurrentChange(val){
        if (val) {
          this.CHANGE_SETTING({
                key: "dictName",
                value: val.name
            })
        this.CHANGE_SETTING({
            key: "dictId",
            value: val.id
        })
        }
        
        this.reload()
      },
      //新增数据
      createData() {
        this.dialogFormVisible = false
        let self = this
        console.log(self.form)
        
        addDictype({
          "name":self.form.name,
          "value":self.form.value
        }).then(function(res){
          self.reflash = true
          console.log(res)
        }).catch(function(error){

        })
      },
      //更新数据
      updateData() {
        this.dialogFormVisible = false

        let self = this
        updateDictype({
          "name":self.form.name,
          "value":self.form.value
        }).then(function(res){
          self.reflash = true
          console.log(res)
        }).catch(function(error){

        })
      },
      //获取分页数据
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      cancel(){
      },
      selectionChangeHandler(val) {
      },
      
    }
  }
</script>
  
<style scoped>
.handle-box {
    margin-bottom: 20px;
}
</style>
  