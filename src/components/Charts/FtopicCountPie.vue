<template>
  <!-- 发帖 -->
  <div :class="className" :style="{height:height,width:width}"></div>
</template>
<script>
import echarts from "echarts";
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "900px"
    },
    height: {
      type: String,
      default: "450px"
    },
    chartData: {
      type: Object
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        //   this.watchPie = val;
        //  this.$set(this.watchPie, 'rows', val)
        this.getPieChart(val);
      }
    }
  },
  data() {
    return {
      chart: null,
      legend: [],
      series: [],
      array: [],
      pieName: [],
      data: null,
      value: "all",
      listQuery: {},
      watchPie: {},
      subtext: 0
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  mounted() {
    //加载饼形图数据
    //   var arry = JSON.parse(localStorage.getItem('lineChartData'))
    //   this.array = arry.Data;
    // //   this.pieName = arry.pie.xVal;
    //   arry.Data.map(((item, index) => {
    //     // this.array.push(Object.assign({}, {
    //     //   value: item,
    //     //   name: arry.pie.xVal[index]
    //     // }, ))
    //       this.pieName.push(item.Name)
    //   }))
    //   this.initChart();
  },
  created() {},
  methods: {
    getPieChart(val) {
      this.$set(this.watchPie, "rows", val);
      var arry = this.watchPie.rows;
      //   this.array = this.watchPie.rows.Data;
      arry.Data.map((item, index) => {
        this.array.push(
          Object.assign(
            {},
            {
              value: item.TopicCount,
              name: item.CompanyName.replace("（", "")
                .replace("）", "")
                .substring(0, 2)
            }
          )
        );
        this.subtext += Number(item.TopicCount);
        this.pieName.push(
          item.CompanyName.replace("（", "")
            .replace("）", "")
            .substring(0, 2)
        );
      });
      this.pieName.reverse();
      this.initChart();
    },
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$el);
      this.chart.setOption({
        title: {
          text: "发帖统计",
          subtext: "发帖总数："+this.subtext,
          x: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "right",
          // data: this.array
          data: this.pieName
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            data: this.array,
            //    data:[
            //     {value:335, name:'直接访问'},
            //     {value:310, name:'邮件营销'},
            //     {value:234, name:'联盟广告'},
            //     {value:135, name:'视频广告'},
            //     {value:1548, name:'搜索引擎'}
            // ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>
