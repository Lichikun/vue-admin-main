<template>
  <div class="app-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_dashboard_user_number" class="total-icon" />
            <div class="total-title">用户总数</div>
            <div class="total-value">{{ userNum }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_dashboard_shop_number" class="total-icon" />
            <div class="total-title">商店总数</div>
            <div class="total-value">{{ shopNum }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_dashboard_goods_number" class="total-icon" />
            <div class="total-title">商品总数</div>
            <div class="total-value">{{ goodsNum }}</div>
          </div>
        </el-col>
        <!--<el-col :span="6">-->
        <!--<div class="total-frame">-->
        <!--<svg-icon icon-class="total-week" class="total-icon">-->
        <!--</svg-icon>-->
        <!--<div class="total-title">近7天销售总额</div>-->
        <!--<div class="total-value">￥50000.00</div>-->
        <!--</div>-->
        <!--</el-col>-->
      </el-row>
    </div>

    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger"
                >({{ orders4 }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待支付订单</span>
              <span style="float: right" class="color-danger"
                >({{ orders0 }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger"
                >({{ orders1 }})</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待收货订单</span>
              <span style="float: right" class="color-danger"
                >({{ orders2 }})</span
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待评价订单</span>
              <span style="float: right" class="color-danger"
                >({{ orders3 }})</span
              >
            </div>
          </el-col>
          <!-- <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退款申请</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col> -->
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row> -->
      </div>
    </div>
    <div class="overview-layout">
      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value"
                  >100</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >400</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >50</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >500</el-col
                >
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">库存紧张</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value"
                  >100</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >200</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >1000</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >5000</el-col
                >
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row> -->
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">宠物价格范围</div>
            <div style="padding: 40px">
              <div
                id="petPriceChart"
                :style="{ width: '100%', height: '300px' }"
              ></div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品价格范围</div>
            <div style="padding: 40px">
              <div
                id="goodsPriceChart"
                :style="{ width: '100%', height: '300px' }"
              ></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">宠物种类分布</div>
            <div style="padding: 40px">
              <div
                id="petTypeChart"
                :style="{ width: '100%', height: '300px' }"
              ></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
//import { str2Date } from "@/utils/date";
import img_dashboard_user_number from "@/assets/images/dashboard_user_number.png";
import img_dashboard_shop_number from "@/assets/images/dashboard_shop_number.png";
import img_dashboard_goods_number from "@/assets/images/dashboard_goods_number.png";
import { getUserNum } from "@/api/apis/user";
import { getShopNum } from "@/api/apis/shop";
import { getGoodsNum } from "@/api/apis/goods";
import { getOrdersState } from "@/api/apis/orders";

// const DATA_FROM_BACKEND = {
//   columns: ["date", "orderCount", "orderAmount"],
//   rows: [
//     { date: "2018-11-01", orderCount: 10, orderAmount: 1093 },
//     { date: "2018-11-02", orderCount: 20, orderAmount: 2230 },
//     { date: "2018-11-03", orderCount: 33, orderAmount: 3623 },
//     { date: "2018-11-04", orderCount: 50, orderAmount: 6423 },
//     { date: "2018-11-05", orderCount: 80, orderAmount: 8492 },
//     { date: "2018-11-06", orderCount: 60, orderAmount: 6293 },
//     { date: "2018-11-07", orderCount: 20, orderAmount: 2293 },
//     { date: "2018-11-08", orderCount: 60, orderAmount: 6293 },
//     { date: "2018-11-09", orderCount: 50, orderAmount: 5293 },
//     { date: "2018-11-10", orderCount: 30, orderAmount: 3293 },
//     { date: "2018-11-11", orderCount: 20, orderAmount: 2293 },
//     { date: "2018-11-12", orderCount: 80, orderAmount: 8293 },
//     { date: "2018-11-13", orderCount: 100, orderAmount: 10293 },
//     { date: "2018-11-14", orderCount: 10, orderAmount: 1293 },
//     { date: "2018-11-15", orderCount: 40, orderAmount: 4293 },
//   ],
// };
export default {
  name: "home",
  data() {
    return {
      userNum: "",
      shopNum: "",
      goodsNum: "",
      ordersMinus1: "",
      orders0: "",
      orders1: "",
      orders2: "",
      orders3: "",
      orders4: "",
      // pickerOptions: {
      //   shortcuts: [
      //     {
      //       text: "最近一周",
      //       onClick(picker) {
      //         const end = new Date();
      //         let start = new Date();
      //         start.setFullYear(2018);
      //         start.setMonth(10);
      //         start.setDate(1);
      //         end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //     {
      //       text: "最近一月",
      //       onClick(picker) {
      //         const end = new Date();
      //         let start = new Date();
      //         start.setFullYear(2018);
      //         start.setMonth(10);
      //         start.setDate(1);
      //         end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //   ],
      // },
      orderCountDate: "",
      chartSettings: {
        xAxisType: "time",
        area: true,
        axisSite: { right: ["orderAmount"] },
        labelMap: { orderCount: "订单数量", orderAmount: "订单金额" },
      },
      chartData: {
        columns: [],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      img_dashboard_user_number,
      img_dashboard_shop_number,
      img_dashboard_goods_number,
    };
  },
  created() {
    // this.initOrderCountDate();
    // this.getData();
  },
  mounted() {
    let self = this;

    getUserNum({})
      .then(function (res) {
        self.userNum = res.data;
      })
      .catch(function (error) {});

    getShopNum({})
      .then(function (res) {
        self.shopNum = res.data;
      })
      .catch(function (error) {});

    getGoodsNum({})
      .then(function (res) {
        self.goodsNum = res.data;
      })
      .catch(function (error) {});

    getOrdersState({})
      .then(function (res) {
        self.ordersMinus1 = res.data["-1"] == null ? 0 : res.data["-1"];
        self.orders0 = res.data["0"] == null ? 0 : res.data["0"];
        self.orders1 = res.data["1"] == null ? 0 : res.data["1"];
        self.orders2 = res.data["2"] == null ? 0 : res.data["2"];
        self.orders3 = res.data["3"] == null ? 0 : res.data["3"];
        self.orders4 = res.data["4"] == null ? 0 : res.data["4"];
      })
      .catch(function (error) {});

    this.drawBar();
  },
  methods: {
    // handleDateChange() {
    //   this.getData();
    // },
    // initOrderCountDate() {
    //   let start = new Date();
    //   start.setFullYear(2018);
    //   start.setMonth(10);
    //   start.setDate(1);
    //   const end = new Date();
    //   end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
    //   this.orderCountDate = [start, end];
    // },
    // getData() {
    //   setTimeout(() => {
    //     this.chartData = {
    //       columns: ["date", "orderCount", "orderAmount"],
    //       rows: [],
    //     };
    //     for(let i=0;i<DATA_FROM_BACKEND.rows.length;i++){
    //       let item=DATA_FROM_BACKEND.rows[i];
    //       let currDate=str2Date(item.date);
    //       let start=this.orderCountDate[0];
    //       let end=this.orderCountDate[1];
    //       if(currDate.getTime()>=start.getTime()&&currDate.getTime()<=end.getTime()){
    //         this.chartData.rows.push(item);
    //       }
    //     }
    //     this.dataEmpty = false;
    //     this.loading = false
    //   }, 1000);
    // },

    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      // 全局使用 echarts 初始化（this.$echarts）
      let petPriceChart = this.$echarts.init(
        document.getElementById("petPriceChart")
      ); //宠物价格
      let goodsPriceChart = this.$echarts.init(
        document.getElementById("goodsPriceChart")
      ); //商品价格
      let petTypeChart = this.$echarts.init(
        document.getElementById("petTypeChart")
      );
      // 宠物价格
      petPriceChart.setOption({
        title: {
          text: "",
        },
        tooltip: {},
        series: [
          {
            type: "pie",
            data: [
              {
                value: 25,
                name: "1-800",
              },
              {
                value: 234,
                name: "801-1600",
              },
              {
                value: 118,
                name: "1601-2400",
              },
              {
                value: 88,
                name: "2400以上",
              },
            ],
          },
        ],
      });
      //商品价格
      goodsPriceChart.setOption({
        title: {
          text: "",
        },
        tooltip: {},
        series: [
          {
            type: "pie",
            data: [
              {
                value: 1335,
                name: "0-100",
              },
              {
                value: 863,
                name: "101-300",
              },
              {
                value: 420,
                name: "301-500",
              },
              {
                value: 120,
                name: "500以上",
              },
            ],
          },
        ],
      });
      petTypeChart.setOption({
        title: {
          text: "",
        },
        tooltip: {},
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: [23, 24, 18, 25, 27, 28, 25],
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.app-container {
  margin-left: 120px;
  margin-right: 120px;
}

.address-layout {
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409eff;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #dcdfe6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}
.address-content {
  padding: 20px;
  font-size: 18px;
}
</style>
