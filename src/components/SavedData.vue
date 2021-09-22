<template>
  <el-card class="box-card">
    <h1>Zabeleženi proračuni</h1>
    <el-table
      :data="data"
      style="width: 100%">
      <el-table-column label="Kredit">
        <template slot-scope="scope">
          <span>{{ scope.row.onlyLoan | money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Učešće">
        <template slot-scope="scope">
          <span>{{ scope.row.participationSum | money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Kamatna stopa">
        <template slot-scope="scope">
          <span>{{ scope.row.annualRate }} %</span>
        </template>
      </el-table-column>
      <el-table-column label="Mesečna rata">
        <template slot-scope="scope">
          <span>{{ scope.row.monthlyPayment | money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Period otplate">
        <template slot-scope="scope">
          <span>{{ scope.row.earlyPayoff ? scope.row.earlyMonths : scope.row.months }} meseci</span>
        </template>
      </el-table-column>
      <el-table-column label="Godisnja prevremena otplata">
        <template slot-scope="scope">
          <template v-if="scope.row.earlyPayoff">{{ scope.row.yearlyBonus | money }}</template>
          <template v-else>/</template>
        </template>
      </el-table-column>
      <el-table-column label="Ukupna kamata">
        <template slot-scope="scope">
          <template v-if="scope.row.earlyPayoff">{{ scope.row.banksShare | money }}</template>
          <template v-else>{{ (scope.row.totalLoan - scope.row.onlyLoan) | money }}</template>
        </template>
      </el-table-column>
      <el-table-column label="Ukupna suma za otplatu">
        <template slot-scope="scope">
          <template v-if="scope.row.earlyPayoff">{{ scope.row.earlyTotal | money }}</template>
          <template v-else>{{ scope.row.totalLoan | money }}</template>
        </template>
      </el-table-column>
      <el-table-column label="" width="60">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="$emit('remove', scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 20px;
}
</style>
