<template>
  <div class="main-setting-menu">
    <HeaderMenu
      :title="$t('personalExtensions.title')"
      :routeBackName="routeBackName"
    />
    <ul class="list-main-setting list-menu">
      <li class="row-in-setting item">
        <RowItem
          @click="goToCommentsPopup()"
          :title="$t('personalExtensions.commentTitle')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="6"
        />
        <router-view />
      </li>
      <li class="item">
        <RowItem
          @click="goToKeysPopup()"
          :title="$t('personalExtensions.keyTitle')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="8"
        />
        <router-view />
      </li>
      <li class="item">
        <RowItem
          @click="goToMarkersPopup()"
          :title="$t('personalExtensions.markerTitle')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="7"
        />
        <router-view />
      </li>
      <li class="item">
        <RowItem
          @click="goToLinksPopup()"
          :title="$t('personalExtensions.LinksTitle')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="i"
          :fontIcon="true"
        />
        <router-view />
      </li>
    </ul>
  </div>
</template>

<script>
import menuService from "../../../../../services/menu";
export default {
  data() {
    return {
      routeBackName: "main",
      commentsIcon: "fa fa-comment-o",
      keysIcon: "fa fa-key",
      markersIcon: "fa fa-paint-brush",
      linksIcon: "fa fa-link",
    };
  },
  methods: {
    goToCommentsPopup() {
      // this.$router.push({ name: "comments-popup" });
      menuService.openPersonalCommentsMenu();
      menuService.closeMenu();
    },
    goToKeysPopup() {
      // this.$router.push({ name: "keys-popup" });
      menuService.openPersonalKeysMenu();
      menuService.closeMenu();
    },
    //markers-popup
    goToMarkersPopup() {
      // this.$router.push({ name: "markers-popup" });
      menuService.openPersonalMarksMenu();
      menuService.closeMenu();
    },
    goToLinksPopup() {
      menuService.openPersonalLinksMenu();
      menuService.closeMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
.main-setting-menu {
  width: -webkit-fill-available;
  z-index: 3;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.list-main-setting {
  display: flex;
  flex-direction: column;
  // margin: 0;
  // padding: 0;
  list-style-type: none;
}
</style>
