<template>
  <v-app id="main">
    <div class="top-padding"></div>
    <CardView>
      <v-card-text>
        <div class="display-5 font-weight-thin">Todays</div>
      </v-card-text>
      <v-card-text>
        <div id="chart">
          <apexchart ref="chart" type=area height=350 :options="chartOptions" :series="series" />
        </div>
        <v-divider class="my-2"></v-divider>
        <v-data-table
          id="main-data-table"
          height="'347px'"
          :headers="headers"
          :items="todayRegisteredRefugeeList"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-card-text>
    </CardView>
  </v-app>
</template>

<script>
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts';
import CardView from '../components/CardView';

export default {
  name: 'Main',
  components: {
    CardView,
    apexchart: VueApexCharts
  },
  data () {
    return {
      headers: [
        { text: '이름', value: 'name' },
        { text: '국적', value: 'nationality' },
        { text: '생년월일', value: 'birth' },
        { text: '등록일자', value: 'createdAt' },
        { text: '상태', value: 'status' }
      ],
      todayRegisteredRefugeeList: [], // Today's registrated refugee list
      todayVisitedRefugeelist: [], // Today's visited refugee list
      weekendDate: [], // Date list from 6 day's ago to Today
      weekendRegistration: [], // count of weekend registrated refugee
      weekendVisitation: [], // count of weekend visited refugee
      maxCount: 0,
      series: [
        {
          name: 'Registration',
          data: []
        },
        {
          name: 'Visitation',
          data: []
        }
      ],
      chartOptions: {
        chart: {
          shadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 1
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Statistic (1week)',
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: 'datetime',
          labels: {
            show: true
          },
          categories: []
        },
        yaxis: {
          title: {
            text: 'Count'
          },
          min: 0,
          max: 40
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      }
    };
  },
  methods: {
    getWeekendDate () {
      var thisWeek = [];
      for (var i = 6; i >= 0; i--) {
        var today = new Date();
        var resultDay = today.getTime() - (i * 24 * 60 * 60 * 1000);
        today.setTime(resultDay);
        var yyyy = today.getFullYear();
        var mm = Number(today.getMonth()) + 1;
        var dd = today.getDate();
        if (mm < 10) { mm = '0' + mm; };
        if (dd < 10) { dd = '0' + dd; };
        thisWeek[6 - i] = yyyy + '-' + mm + '-' + dd;
      }
      return thisWeek;
    },
    getDateFormat (date) {
      function formating (num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
      }
      return date.getFullYear() + '-' + formating(date.getMonth() + 1) + '-' + formating(date.getDate());
    },
    setMaxHeight (array) {
      if (this.maxCount < Math.max.apply(0, array)) {
        this.maxCount = Math.max.apply(0, array);
      }
    },
    async getTodayRefugees (weekendDate) {
      const res = await axios.get('api/v1/refugee?st_date=' + weekendDate[0] + '&ed_date=' + weekendDate[6]);
      const list = res.data.rows;
      const countMap = { one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven: 0 };
      for (let i = 0; i < list.length; i++) {
        if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[0]) {
          countMap.one += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[1]) {
          countMap.two += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[2]) {
          countMap.three += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[3]) {
          countMap.four += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[4]) {
          countMap.five += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[5]) {
          countMap.six += 1;
        } else {
          countMap.seven += 1;
          list[i].birth = this.getDateFormat(new Date(list[i].birth));
          list[i].createdAt = this.getDateFormat(new Date(list[i].createdAt));
          this.todayRegisteredRefugeeList.push(list[i]);
        }
      }
      this.weekendRegistration.push(countMap.one, countMap.two, countMap.three, countMap.four, countMap.five, countMap.six, countMap.seven);
      this.series[0].data = this.weekendRegistration;
      this.setMaxHeight(this.weekendRegistration);
    },
    async getTodayVisitor (weekendDate) {
      const res = await axios.get('api/v1/visitlog?st_date=' + weekendDate[0] + '&ed_date=' + weekendDate[6]);
      const list = res.data.rows;
      const countMap = { one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven: 0 };
      for (let i = 0; i < list.length; i++) {
        if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[0]) {
          countMap.one += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[1]) {
          countMap.two += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[2]) {
          countMap.three += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[3]) {
          countMap.four += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[4]) {
          countMap.five += 1;
        } else if (this.getDateFormat(new Date(list[i].createdAt)) === weekendDate[5]) {
          countMap.six += 1;
        } else {
          countMap.seven += 1;
          list[i].createdAt = this.getDateFormat(new Date(list[i].createdAt));
          this.todayVisitedRefugeelist.push(list[i]);
        }
      }
      this.weekendVisitation.push(countMap.one, countMap.two, countMap.three, countMap.four, countMap.five, countMap.six, countMap.seven);
      this.series[1].data = this.weekendVisitation;
      this.setMaxHeight(this.weekendVisitation);
    }
  },
  async mounted () {
    this.weekendDate = this.getWeekendDate();
    this.chartOptions.xaxis.categories = this.weekendDate;
    await this.getTodayRefugees(this.weekendDate);
    await this.getTodayVisitor(this.weekendDate);
    this.chartOptions.yaxis.max = this.maxCount + 5;
    this.$refs.chart.refresh();
  }
};
</script>

<style scoped>
  #main {
    width: 100%;
  }

  .top-padding {
    height: 3%;
  }
</style>
