<template>
  <div class="full-center rtl">
    <!-- <p v-for="action in actionsToDo" :key="action.id">
      {{ action }}
    </p> -->
    <h1 v-if="error.active">
      {{ error.code }}
    </h1>
    <div v-else>
      <h1 v-if="status.show">{{ status.content }}</h1>
      <DiskContainer
        v-if="disks.length > 1"
        :disks="disks"
        @selected="setDisk"
        @start="openDisk"
        :selected="selectedDisk"
      />
    </div>
  </div>
</template>

<script>
import DiskContainer from "@/components/startupComponents/DiskContainer.vue";
export default {
  components: { DiskContainer },
  data() {
    return {
      actions: [
        { id: "findAllDisk", done: false, index: 0 },
        { id: "startProtectionSystem", done: false, index: 1 },
        { id: "startSearcher", done: false, index: 2 },
        { id: "startMefOtzar", done: false, index: 3 },
      ],
      selectedDisk: null,
      error: { code: 1, active: false },
      status: { content: "", show: true },
      disks: [],
    };
  },
  computed: {
    actionsToDo() {
      return this.actions
        .filter((a) => !a.done)
        .sort((a, b) => a.index - b.index);
    },
  },
  methods: {
    openDisk() {
      this.setDisk(this.selectedDisk);
      this.disks = [];
      this.startActions();
    },
    async action_DiskLoader() {
      //if we came from browser then return (you should never come here from browser env)
      if (!globalThis.RUNNER_API) return;
      //get all disks
      this.disks = await globalThis.RUNNER_API.getOtzarDriveList();

      if (!this.disks.length) {
        this.error.code = "DISK_NOT_FOUND";
        this.error.active = true;
        return false;
      } else if (this.disks.length > 1) {
        this.status.content = "בחר דיסק";
        return false;
      } else {
        this.setDisk(this.disks[0]);
      }
      return true;
    },
    async action_startProtectionSystem() {
      let isDriverInstall = await globalThis.RUNNER_API.isDriverInstall();
      if (!isDriverInstall) {
        //install driver
        const startDriver = await globalThis.RUNNER_API.InstallStartDriver();
        if (startDriver == "need admin") {
          //stop and request admin
          this.setError("NEED_ADMIN_PRIVALGE");
          return false;
        }

        //after check
        isDriverInsall = await globalThis.RUNNER_API.isDriverInstall();
        if (isDriverInstall) {
          this.error.code = "CANNOT_INSTALL_DRIVER";
          this.error.active = true;
          return false;
        }
      }

      let isDriverRunnging = await globalThis.RUNNER_API.isDriverRunnging();
      if (!isDriverRunnging) {
        //start driver
        await globalThis.RUNNER_API.InstallStartDriver();
      }
      isDriverRunnging = await globalThis.RUNNER_API.isDriverRunnging();
      if (!isDriverRunnging) {
        this.error.code = "CANNOT_START_DRIVER";
        this.error.active = true;
        return false;
      }
      return isDriverRunnging;
    },
    async action_startSearcher() {
      const startSeartch = await globalThis.RUNNER_API.StartSearcher(
        this.selectedDisk.mountPoint
      );
      return true;
    },
    setStatus(content, show = true) {
      this.status.content = content;
      this.show = show;
    },
    setError(code, show = true) {
      this.error.code = code;
      this.error.active = show;
    },
    setDisk(disk) {
      this.selectedDisk = disk;
      this.actions = this.actions.filter((a) => a.id !== "findAllDisk");
    },
    async startActions() {
      await globalThis.RUNNER_API.updateManager.startAsarUpdateAndshutdownApp();
      //globalThis.CLOSE_APP();
      //start to do actions
      let ret = true;
      for (const action of this.actions) {
        switch (action.id) {
          case "findAllDisk":
            this.setStatus("מאתר דיסק מחובר");

            ret = await this.action_DiskLoader();

            if (!ret) break;
            continue;
          case "startProtectionSystem":
            this.setStatus("מפעיל דרייבר");
            ret = await this.action_startProtectionSystem();
            if (!ret) break;
            continue;
          case "startSearcher":
            this.setStatus("מפעיל מנוע חיפוש");
            ret = await this.action_startSearcher(this.selectedDisk.mountPoint);
            if (!ret) break;
            continue;
        }

        if (!ret) break;
      }

      if (ret) {
        //start the main app
        this.setStatus("מפעיל רכיבי תוכנה");
        globalThis.RUNNER_API.startMainApp(this.selectedDisk.mountPoint);
      }
    },
  },
  async mounted() {
    this.startActions();
  },
};
</script>

<style lang="scss" scoped>
.rtl {
  direction: rtl;
}
.full-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
</style>
