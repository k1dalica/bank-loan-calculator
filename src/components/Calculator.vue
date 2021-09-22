<template>
  <div class="box-wrapper">
    <el-card class="box-card small">
      <h1>Kalkulator kredita</h1>
      <el-row :gutter="40">
        <el-col :span="24" class="row">
          <label>Kamatna stopa</label>
          <el-slider
            v-model="annualRate"
            :step="0.01"
            show-input
            :show-input-controls="false"
            :min="1"
            :max="10"
            label="EUR" />
        </el-col>
        <el-col :span="24" class="row">
          <label>Iznos kredita</label>
          <el-slider
            v-model="loan"
            :format-tooltip="(val) => formatMoney(val)"
            show-input
            :show-input-controls="false"
            :marks="loanMarks"
            :min="1000"
            :max="200000"
            label="EUR" />
        </el-col>
        <el-col :span="24" class="row">
          <label>Učešće</label>
          <el-slider
            v-model="participation"
            :format-tooltip="(val) => `${val}% učešće`"
            show-input
            :show-input-controls="false"
            :marks="participationMarks"
            :min="0"
            :max="90"
            label="učešće" />
        </el-col>
        <el-col :span="24" class="row">
          <label>Broj meseci</label>
          <el-slider
            v-model="months"
            :format-tooltip="(val) => `${val} meseci`"
            show-input
            :show-input-controls="false"
            :marks="monthMarks"
            :min="12"
            :max="360"
            label="meseci" />
        </el-col>
        <el-col :span="24" class="row">
          <el-switch v-model="earlyPayoff" active-text="Prevremena otplata kredita" />
        </el-col>
        <template v-if="earlyPayoff">
          <el-col :span="24" class="row">
            <label>Godisnja prevremena otplata</label>
            <el-slider
              v-model="yearlyBonus"
              :format-tooltip="(val) => formatMoney(val)"
              show-input
              :show-input-controls="false"
              :marks="yearlyBonusMarks"
              :min="500"
              :max="30000"
              label="meseci" />
          </el-col>
          <el-col :md="12" :xs="24" class="row">
            <label>Max. prevremena otplata bez penala</label>
            <el-input v-model="earlyPayoffLimit">
              <template slot="append">€</template>
            </el-input>
          </el-col>
          <el-col :md="12" :xs="24" class="row">
            <label>Kamata za prevremenu otplatu</label>
            <el-slider
              v-model="earlyPayoffRate"
              :format-tooltip="(val) => `${val}%`"
              :step="0.01"
              show-input
              :show-input-controls="false"
              :marks="loanMarks"
              :min="0.5"
              :max="1"
              label="EUR" />
          </el-col>
        </template>
      </el-row>

      <el-row class="info">
        <el-col :span="24"><h2>Info</h2></el-col>
        <el-col :md="8" :xs="12">
          <h3>Kredit</h3>
          <span>{{ onlyLoan | money }}</span>
        </el-col>
        <el-col :md="8" :xs="12">
          <h3>Učešće</h3>
          <span>{{ participationSum | money }}</span>
        </el-col>
        <el-col :md="8" :xs="12">
          <h3>Mesečna rata</h3>
          <span>{{ monthlyPayment | money }}</span>
        </el-col>
        <el-col :md="8" :xs="12">
          <h3>Period otplate</h3>
          <span>{{ months }} meseci</span>
        </el-col>
        <el-col :md="8" :xs="12">
          <h3>Kamatna stopa</h3>
          <span>{{ annualRate }} %</span>
        </el-col>
        <el-col :md="8" :xs="12">
          <h3>Ukupna suma za otplatu</h3>
          <span>{{ totalLoan | money }}</span>
        </el-col>
        <template v-if="earlyPayoff">
          <el-col :span="24"><h2>Info za prevremenu otplatu</h2></el-col>
          <el-col :span="12">
            <h3>God. prevremena otplata</h3>
            <span>{{ yearlyBonus | money }}</span>
          </el-col>
          <el-col :span="12">
            <h3>Period otplate</h3>
            <span>{{ earlyMonths }} meseci</span>
          </el-col>
          <el-col :span="12">
            <h3>Kamata</h3>
            <span>{{ banksShare | money }}</span>
          </el-col>
          <el-col :span="12">
            <h3>Ukupna suma za otplatu</h3>
            <span>{{ earlyTotal | money }}</span>
          </el-col>
        </template>
      </el-row>
      <div class="buttons">
        <el-button type="success" icon="el-icon-s-order" round @click="save()">Sačuvaj</el-button>
      </div>
    </el-card>

    <saved-data :data="data" @remove="remove($event)" />
  </div>
</template>

<script>
import SavedData from './SavedData'

export default {
  components: {
    SavedData
  },

  data () {
    return {
      annualRate: 2.55,
      loan: 10000,
      participation: 20,
      months: 60,
      yearlyBonus: 0,
      earlyPayoff: false,
      earlyPayoffLimit: 8507,
      earlyPayoffRate: 0.5,

      earlyMonths: 0,
      banksShare: 0,

      loanMarks: {
        1000: '1k €',
        20000: '20k €',
        50000: '50k €',
        100000: '100k €',
        200000: '200k €'
      },

      participationMarks: {
        0: '0%',
        10: '10%',
        20: '20%',
        30: '30%',
        50: '50%',
        70: '70%',
        90: '90%'
      },

      monthMarks: {
        12: '12 meseci',
        60: '60 meseci',
        120: '120 meseci',
        180: '180 meseci',
        240: '240 meseci',
        300: '300 meseci',
        360: '360 meseci'
      },

      yearlyBonusMarks: {
        500: '500 €',
        4000: '4k €',
        8000: '8k €',
        15000: '15k €',
        20000: '20k €',
        30000: '30k €'
      },

      data: []
    }
  },

  computed: {
    onlyLoan () {
      return parseFloat(((this.loan - this.participationSum) || 0).toFixed(2))
    },

    participationSum () {
      return parseFloat((this.loan * (this.participation / 100)).toFixed(2))
    },

    monthlyPayment () {
      return parseFloat(this.getMonthlyPayment(this.annualRate, this.months, this.onlyLoan).toFixed(2))
    },

    totalLoan () {
      return this.monthlyPayment * this.months
    },

    earlyTotal () {
      return this.banksShare + this.onlyLoan
    }
  },

  watch: {
    annualRate () {
      this.startSimulation()
    },

    loan () {
      this.startSimulation()
    },

    participation () {
      this.startSimulation()
    },

    months () {
      this.startSimulation()
    },

    yearlyBonus () {
      this.startSimulation()
    },

    earlyPayoff () {
      this.startSimulation()
    },

    earlyPayoffLimit () {
      this.startSimulation()
    },

    earlyPayoffRate () {
      this.startSimulation()
    }
  },

  created () {
    const data = localStorage.getItem('data')
    if (data) this.data = JSON.parse(data)
  },

  methods: {
    remove (index) {
      this.data.splice(index, 1)
      localStorage.setItem('data', JSON.stringify(this.data))
    },

    save () {
      this.data.push({
        annualRate: this.annualRate,
        loan: this.loan,
        participation: this.participation,
        months: this.months,
        yearlyBonus: this.yearlyBonus,
        earlyPayoff: this.earlyPayoff,
        earlyPayoffLimit: this.earlyPayoffLimit,
        earlyPayoffRate: this.earlyPayoffRate,
        onlyLoan: this.onlyLoan,
        participationSum: this.participationSum,
        monthlyPayment: this.monthlyPayment,
        earlyMonths: this.earlyMonths,
        banksShare: this.banksShare,
        totalLoan: this.totalLoan,
        earlyTotal: this.earlyTotal
      })
      localStorage.setItem('data', JSON.stringify(this.data))
    },

    startSimulation () {
      let total = 0
      let sum = this.onlyLoan
      for (let i = 1; i <= this.months; i++) {
        if (sum <= 0) return this.setEarlyInfo(i, total)
        sum += sum * this.annualRate / 1200
        sum -= this.monthlyPayment
        total += this.monthlyPayment

        if (this.earlyPayoff && i % 12 === 0) {
          const bonus = sum < this.yearlyBonus ? sum : this.yearlyBonus
          if (sum <= 0) return this.setEarlyInfo(i, total)
          sum -= bonus
          total += bonus
          if (bonus > this.earlyPayoffLimit) {
            total += (bonus - this.earlyPayoffLimit) * (this.earlyPayoffRate / 100)
          }
          if (sum <= 0) return this.setEarlyInfo(i, total)
        }
      }
    },

    setEarlyInfo (i, total) {
      this.earlyMonths = i
      this.banksShare = total - this.onlyLoan
    },

    getMonthlyPayment (annualRate, monthlyPayments, presentValue) {
      const monthlyRate = annualRate / 1200
      const t1 = 1 + monthlyRate
      const t3 = Math.pow(t1, monthlyPayments)
      return (presentValue) / (((1 - (1 / (t3))) / monthlyRate))
    },

    formatMoney (value, currency = 'EUR') {
      const options = { minimumFractionDigits: 2 }
      options.style = 'currency'
      options.currency = currency

      return Intl.NumberFormat('de-DE', options).format(value)
    }
  }
}
</script>

<style scoped lang="scss">
  .box-wrapper {
    .box-card {
      &.small {
        width: 100%;
        max-width: 900px;
        margin: 100px auto;
        padding: 20px;
        box-sizing: border-box;
      }
    }
    h2 {
      font-size: 30px;
      font-weight: 400;
      margin: 25px 0 15px 0;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    .row {
      margin: 20px 0;
    }

    .info {
      margin-top: 25px;
      h3 {
        font-size: 20px;
        font-weight: 300;
        margin: 0 0 5px 0;
      }
      span {
        display: block;
        font-weight: bold;
        font-size: 25px;
        margin-bottom: 20px;
      }
    }
  }
  .buttons {
    text-align: center;
    margin-top: 20px;
  }
</style>
