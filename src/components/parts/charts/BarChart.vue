<template>
  <div style="margin-top: 15px; width: 100%;">
    <div :id="'chart-'+ id">
    </div>
  </div>
</template>

<script>
import ApexCharts from 'apexcharts'

export default {
  name: "BarChart",
  props: {
    id: {required: true},
    stacked: {required: true}
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
          type: 'bar',
          stacked: this.stacked,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 2,
            offsetX: 0,
            barHeight: this.stacked ? 45 : 90,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 600
                }
              }
            }
          },
        },
        colors: this.options.colors,
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
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: this.options.categories
        },
        yaxis: {
          title: {
            text: undefined
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
          offsetY: -5,
          floating: true
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
