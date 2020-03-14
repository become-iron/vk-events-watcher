<template>
  <v-simple-table>
    <thead>
      <tr>
        <th />
        <th>
          {{ $t('events.oldValue') }}
        </th>
        <th>
          {{ $t('events.newValue') }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="([oldValue, newValue], property) of event.eventData"
        :key="property"
      >
        <td>
          {{ formatProperty(property) }}
        </td>
        <td class="text-break">
          {{ formatValue(property, oldValue) }}
        </td>
        <td class="text-break">
          {{ formatValue(property, newValue) }}
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
  import isNil from 'lodash/isNil'
  import { get } from 'vuex-pathify'

  import { entityTypes, viewTypeToEntityType } from '@/configurations/entity'
  import { EventData } from '@/interfaces/event'


  export default {
    name: 'EntityChangesTable',

    props: {
      event: {
        type: EventData,
        required: true
      }
    },

    computed: {
      ...get({
        activeView: 'activeView'
      }),

      entityType () {
        return viewTypeToEntityType[this.activeView]
      }
    },

    methods: {
      formatProperty (property) {
        const trKey = `${this.activeView}.fields.${property}`
        return this.$t(trKey)
      },

      // TODO: improve
      formatValue (property, value) {
        if (isNil(value)) { return value }

        if (this.entityType === entityTypes.group) {
          if (property === 'is_closed') {
            const trKey = `${this.activeView}.fieldsMapping.${property}.${value}`
            return this.$t(trKey)
          }
          else if (property === 'trending' || property === 'verified') {
            const trKey = `entities.booleanFieldsMapping.${value}`
            return this.$t(trKey)
          }
        }
        else if (this.entityType === entityTypes.user) {
          if (property === 'relation' || property === 'deactivated') {
            const trKey = `${this.activeView}.fieldsMapping.${property}.${value}`
            return this.$t(trKey)
          }
          else if (property === 'trending' || property === 'verified') {
            const trKey = `entities.booleanFieldsMapping.${value}`
            return this.$t(trKey)
          }
        }

        return value
      }
    }
  }
</script>

<style lang="scss" scoped>
  th:first-child,
  td:first-child {
    min-width: 25%;
  }
</style>
