<template>
  <v-container fluid>
    <ul>
      <li>
        Цель приложения – отслеживать изменения в группах и у друзей пользователя.
      </li>

      <li>
        Если было замечено изменение, то генерируется соответствующее событие: добавление/удаление/изменение группы/друга.
      </li>

      <li>
        Отслеживаются только базовые изменения.
      </li>

      <li>
        Фиксация изменений производится путём сравнения текущего и предыдущего состояний.
      </li>

      <li>
        Приложение не производит фиксацию изменений автономно: необходимо время от времени его запускать.
      </li>

      <li>
        Изменения хранятся локально, а это означает, что отсутствует синхронизация между устройствами и браузерами.
      </li>
    </ul>

    <div class="mt-3">
      <v-btn
        depressed
        @click="resetStore"
      >
        {{ $t('settings.resetStore') }}
      </v-btn>
    </div>
  </v-container>
</template>

<script>
  import { resetEntitiesStores } from '@/utils/longTermStore'
  import { showSuccessMessage } from '@/utils/common'


  export default {
    name: 'SettingsView',

    methods: {
      async  resetStore () {
        await resetEntitiesStores()
        await showSuccessMessage(this.$t('settings.messages.storeIsReset'))
      }
    }
  }
</script>

<style scoped>

</style>
