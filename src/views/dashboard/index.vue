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
      <el-row :gutter="20" style="margin-top: 20px">
        <div class="out-border">
          <div class="layout-title">宠物种类分布</div>
          <div style="padding: 40px">
            <div
              id="petTypeChart"
              :style="{ width: '100%', height: '300px' }"
            ></div>
          </div>
        </div>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品种类分布</div>
            <div style="padding: 40px">
              <div
                id="goodsTypeChart"
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
import { getOrdersState } from "@/api/apis/orders";
import { getPetsPricePhase, getPetsTypeNum } from "@/api/apis/pets";
import {
  getGoodsPricePhase,
  getGoodsTypeNum,
  getGoodsNum,
} from "@/api/apis/goods";

import { logger } from "runjs/lib/common";

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
      petsPricePhase: {},
      goodsPricePhase: {},
      getPetsTypeNum: {},
      getGoodsTypeNum: {},
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

    //获得宠物价格阶段MAP
    getGoodsPricePhase({})
      .then(function (res) {
        self.goodsPricePhase = res.data;
        self.drawGoodsPricePhase(self.goodsPricePhase);
      })
      .catch(function (error) {});

    getPetsPricePhase({})
      .then(function (res) {
        self.petsPricePhase = res.data;
        self.drawPetsPricePhase(self.petsPricePhase);
        //console.log(" self.petsPricePhase:", self.petsPricePhase);
      })
      .catch(function (error) {});

    getPetsTypeNum({})
      .then(function (res) {
        self.getPetsTypeNum = res.data;
        self.drawPetsTypeNum(self.getPetsTypeNum);
        //console.log(" self.petsPricePhase:", self.petsPricePhase);
      })
      .catch(function (error) {});

    getGoodsTypeNum({})
      .then(function (res) {
        self.getGoodsTypeNum = res.data;
        self.drawGoodsTypeNum(self.getGoodsTypeNum);
        //console.log(" self.petsPricePhase:", self.petsPricePhase);
      })
      .catch(function (error) {});
  },
  methods: {
    drawGoodsPricePhase(goodsPricePhase) {
      //商品价格
      let goodsPriceChart = this.$echarts.init(
        document.getElementById("goodsPriceChart")
      );
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
                value: goodsPricePhase["1-100"],
                name: "0-100",
              },
              {
                value: goodsPricePhase["100-300"],
                name: "101-300",
              },
              {
                value: goodsPricePhase["300-500"],
                name: "301-500",
              },
              {
                value: goodsPricePhase["500+"],
                name: "500以上",
              },
            ],
          },
        ],
      });
    },
    drawPetsPricePhase(petsPricePhase1) {
      //宠物价格
      let petPriceChart = this.$echarts.init(
        document.getElementById("petPriceChart")
      );
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
                value: petsPricePhase1["1-800"],
                name: "1-800",
              },
              {
                value: petsPricePhase1["801-1600"],
                name: "801-1600",
              },
              {
                value: petsPricePhase1["1601-2400"],
                name: "1601-2400",
              },
              {
                value: petsPricePhase1["2400+"],
                name: "2400以上",
              },
            ],
          },
        ],
      });
    },
    drawPetsTypeNum(getPetsTypeNum) {
      let PetsType = Object.keys(getPetsTypeNum);
      let PetsNum = Object.values(getPetsTypeNum);
      let petTypeChart = this.$echarts.init(
        document.getElementById("petTypeChart")
      );
      petTypeChart.setOption({
        title: {
          text: "",
        },
        tooltip: {},
        xAxis: {
          data: PetsType,
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: PetsNum,
          },
        ],
      });
    },
    drawGoodsTypeNum(getGoodsTypeNum) {
      // 基于准备好的dom，初始化echarts实例
      // 全局使用 echarts 初始化（this.$echarts）
      let GoodsType = Object.keys(getGoodsTypeNum);
      let GoodsNum = Object.values(getGoodsTypeNum);
      let goodsTypeChart = this.$echarts.init(
        document.getElementById("goodsTypeChart")
      );

      goodsTypeChart.setOption({
        title: {
          text: "",
        },
        tooltip: {},
        xAxis: {
          data: GoodsType,
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: GoodsNum,
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
