<template>
  <div class="contact-staff-main">
    <HeaderMenu :title="title" :routeBackName="routeBackName" />
    <div class="contact-staff-block">
      <div class="company-salers-block block">
        <p class="staff-type">{{ $t("staffContactDetails.sales") }}</p>
        <ContactStaffMemberDetails
          :contactName="$t('staffContactDetails.miriam.name')"
          :contactJob="$t('staffContactDetails.miriam.job')"
          :contactPhone="$t('staffContactDetails.miriam.phone')"
          :contactExtension="$t('staffContactDetails.miriam.extension')"
          :contactEmail="$t('staffContactDetails.miriam.email')"
          :contactActivityTime="$t('staffContactDetails.miriam.activityTime')"
          :abroad="false"
          :job="true"
        />
      </div>
      <div class="company-salers-block block">
        <p class="staff-type">{{ $t("staffContactDetails.otzarHamekuvan") }}</p>
        <ContactStaffMemberDetails
          :contactName="$t('staffContactDetails.erez.name')"
          :contactPhone="$t('staffContactDetails.erez.phone')"
          :contactExtension="$t('staffContactDetails.erez.extension')"
          :contactEmail="$t('staffContactDetails.erez.email')"
          :contactActivityTime="$t('staffContactDetails.erez.activityTime')"
          :abroad="false"
          :job="false"
        />
      </div>
      <div class="company-support-block block">
        <p class="staff-type">
          {{ $t("staffContactDetails.technicalSupport") }}
        </p>
        <ContactStaffMemberDetails
          :contactName="$t('staffContactDetails.krois.name')"
          :contactJob="$t('staffContactDetails.krois.job')"
          :contactPhone="$t('staffContactDetails.krois.phone')"
          :contactExtension="$t('staffContactDetails.krois.extension')"
          :contactEmail="$t('staffContactDetails.krois.email')"
          :contactActivityTime="$t('staffContactDetails.krois.activityTime')"
          :abroad="false"
          :job="true"
        />
      </div>
      <div class="company-agents-block block">
        <p class="staff-type">{{ $t("staffContactDetails.agents") }}</p>
        <ContactStaffMemberDetails
          :contactName="$t('staffContactDetails.rabinovitz.name')"
          :contactJob="$t('staffContactDetails.rabinovitz.job')"
          :contactPhone="$t('staffContactDetails.rabinovitz.phone')"
          :contactEmail="$t('staffContactDetails.rabinovitz.email')"
          :contactAddress="$t('staffContactDetails.rabinovitz.address')"
          :contactCountry="$t('staffContactDetails.rabinovitz.country')"
          :contactSate="$t('staffContactDetails.rabinovitz.state')"
          :abroad="true"
          :job="true"
        />
        <ContactStaffMemberDetails
          :contactName="$t('staffContactDetails.aharonSela.name')"
          :contactJob="$t('staffContactDetails.aharonSela.job')"
          :contactPhone2="$t('staffContactDetails.aharonSela.phone2')"
          :contactEmail="$t('staffContactDetails.aharonSela.email')"
          :contactAddress="$t('staffContactDetails.aharonSela.address')"
          :contactCountry="$t('staffContactDetails.aharonSela.country')"
          :contactSate="$t('staffContactDetails.aharonSela.state')"
          :whatapp="whatsappData"
          :abroad="true"
          :job="true"
        />
        <ContactStaffMemberDetails
          :contactName="$t('staffContactDetails.katzin.name')"
          :contactJob="$t('staffContactDetails.katzin.job')"
          :contactPhone2="$t('staffContactDetails.katzin.phone2')"
          :contactEmail="$t('staffContactDetails.katzin.email')"
          :contactAddress="$t('staffContactDetails.katzin.address')"
          :contactCountry="$t('staffContactDetails.katzin.country')"
          :contactSate="$t('staffContactDetails.katzin.state')"
          :whatapp="
            $t('staffContactDetails.katzin.phone2')
              .replace('-', '')
              .replace('+', '')
          "
          :abroad="true"
          :job="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ContactStaffMemberDetails from "./ContactStaffMemberDetails.vue";
export default {
  components: {
    ContactStaffMemberDetails,
  },
  computed: {
    whatsappData() {
      return this.$t("staffContactDetails.aharonSela.phone2")
        .replace(/-/g, "")
        .replace("+", "");
    },
  },
  data() {
    return {
      title: this.$t("mainMenu.contactName"),
      routeBackName: "contact",
    };
  },
  methods: {
    erezDetails() {
      this.erezHasOpen = !this.erezHasOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin-bottom: 28px;
}
.contact-staff-main {
  width: 100%;
  display: flex;
  // overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
}
.contact-staff-block {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  height: 100%;
  overflow: auto;
  p {
    margin: 0;
    // padding: 0;
  }
}
.show-contact {
  cursor: pointer;
  // font-weight: bold;
  p {
    margin: 0;
    height: 38px;
    line-height: 38px;
    padding: 0 28px;
    color: var(--custom-color1);
  }
}
.row-contact {
  display: flex;
  p {
    margin-left: 5px;
    line-height: 14px;
  }
}
.staff-type {
  padding: 0 20px;
  color: var(--custom-color1);
}
</style>
