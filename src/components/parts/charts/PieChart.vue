<template>
  <div style="width: 100%;">
    <div :id="'chart-'+ id">
    </div>
  </div>
</template>

<script>
import ApexCharts from 'apexcharts'

export default {
  name: "PieChart",
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
          type: 'pie',
          height: this.window_height / 2 - 100
        },
        colors: this.options.colors,
        labels: this.options.categories,
        legend: {
          position: 'bottom'
        }
      }

      var chart = new ApexCharts(document.querySelector("#chart-" + this.id), options);
      chart.render();
    }
  },
  created() {
    myEvent.listen('loaded-' + this.id, (data) => {
      this.data = data.data
      this.options = data.options
      console.log()
      this.render()
    })
  }
}
</script>

<style scoped>

</style>
