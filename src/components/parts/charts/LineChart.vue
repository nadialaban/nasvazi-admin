<template>
  <div style="margin-top: 15px; width: 100%;">
    <div :id="'chart-'+ id" style="margin-top: -30px">
    </div>
  </div>
</template>

<script>
import ApexCharts from 'apexcharts'

export default {
  name: "LineChart",
  props: {
    id: {required: true}
  },
  data() {
    return {
      data: undefined,
      options: undefined
    }
  },
  methods: {
    render: function () {

      var options = {
        series: this.data,
        chart: {
          type: 'line',
          height: this.window_height / 2 - 120,
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        colors: this.options.colors,
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          enabled: false
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#fbf3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: this.options.categories
        },
        yaxis: {
          title: {
            text: this.options.title
          },
          min: 0,
          max: this.options.max
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          floating: true,
          offsetY: 30
        }
      };

      var chart = new ApexCharts(document.querySelector("#chart-" + this.id), options);
      chart.render();
    }
  },
  created() {
    myEvent.listen('loaded-' + this.id, (data) => {
      this.data = data.data
      this.options = data.options
      this.render()
    })
  }
}
</script>

<style scoped>

</style>
