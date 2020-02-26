<template>
<!-- 公司发帖折线图 -->
  <div :class="className" :style="{height:height,width:width}">
</div>


</template>
<script>
  import echarts from 'echarts'
  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '900px'
      },
      height: {
        type: String,
        default: '450px'
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
        value: 'all',
        listQuery: {},
        watchPie:{},
        series:[]
      }
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
 
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
    created() {

    },
    methods: {
      getPieChart(val){
      this.$set(this.watchPie, 'rows', val)
      var arry = this.watchPie.rows;
    //   this.array = this.watchPie.rows.Data;
      arry.Data.map(((item, index) => {
        // this.array.push(Object.assign({}, {
        //   value: item.Count,
        //   name: item.Name
        // }, ))
        this.series.push({
            name:item.Name,
            type:"line",
            stack: '总量',
            data:item.data
        })
        this.pieName.push(item.Name)
      }))
       this.pieName.reverse();
      this.initChart();
      },
      initChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.$el);
        this.chart.setOption({
          title: {
            text: '帖子统计',
            x: 'left'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: this.pieName
          },
          series: this.series
        })
      },
    }
  }
</script>
