<template>
  <div class="container-adv-popup" v-zindex>
    <div class="options-container">
      <!-- הצמדת מילים -->
      <div class="row">
        <div class="right">
          <div class="title-gray rtl fs-12 title-header">
            {{ $t("freeSearchInput.advancedMessage") }}
          </div>
          <advFSItem
            :desc="$t('freeSearchInput.advancedOptions.concatDescription')"
            @click="toggleShowMore(0)"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(0)"
                :title="$t('freeSearchInput.advancedOptions.concatTitle')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    @change="checkAll($event, 'concat')"
                    :checked="globalCheck['concat']"
                    :minus="globalMinus['concat']"
                    :class="{ 'check-minus': globalMinus['concat'] }"
                    icon="concat"
                  />
                </template>
              </itemGeneral>
            </template>
            <template #checks>
              <div class="list-content-adv">
                <!-- <span class="separator"></span> -->
                <div
                  class="worsd-container"
                  v-for="(word, i) in getWords"
                  :key="word.id"
                >
                  <div class="flex flex-align-center dir-ltr">
                    <baseCheckBox
                      v-if="i < getWords.length - 1"
                      class="check-item check-larg space-left"
                      :checked="word['concat']"
                      @change="
                        checkCurrent($event.target.checked, word.id, 'concat')
                      "
                      size="larg"
                      icon="concat"
                    />

                    <span class="text">{{ word.w }}</span>
                  </div>
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key  relative">
            <div class=" fs-12 title-gray">
              {{ $t("freeSearchInput.keyboardSC") }}:
            </div>
            <div class="learn-more " @click="showFSHelp">
              {{ $t("freeSearchInput.learn") }}
            </div>
          </div>
          <div class="short-key-icon first-short">-</div>
        </div>
      </div>

      <!-- אותיות שימוש -->

      <div class="row">
        <div class="right">
          <advFSItem
            @click="toggleShowMore(1)"
            :desc="$t('freeSearchInput.advancedOptions.shimushDescription')"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(1)"
                :title="$t('freeSearchInput.advancedOptions.shimushTitle')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    @change="checkAll($event, 'shimush')"
                    :checked="globalCheck['shimush']"
                    :minus="globalMinus['shimush']"
                  />
                </template>
              </itemGeneral>
            </template>
            <template #checks>
              <div class="list-content-adv">
                <div
                  class="word-container"
                  v-for="word in getWords"
                  :key="word.id"
                >
                  <baseCheckBox
                    v-if="(word['shimush'] != -1) & (word['shimush'] != -2)"
                    class="check-item check-larg check-padd-0 padd-0"
                    size="larg"
                    :checked="word['shimush']"
                    @change="
                      checkCurrent($event.target.checked, word.id, 'shimush')
                    "
                  />
                  <span style="padding: 3px" v-if="word['shimush'] == -2"
                    >{ {{ word.space }} }</span
                  >
                  <span class="text">{{ word.w }}</span>
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">+</div>
        </div>
      </div>

      <!--לפי סדר המילים -->

      <div class="row">
        <div class="right">
          <advFSItem
            :desc="$t('freeSearchInput.advancedOptions.inOrderDescription')"
            @click="toggleShowMore(8)"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(8)"
                :title="$t('freeSearchInput.advancedOptions.inOrderTitle')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    :checked="getOrder"
                    @change="setOrder"
                  />
                </template>
              </itemGeneral>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">&</div>
        </div>
      </div>

      <!-- מרווח בין מילים -->

      <div class="row">
        <div class="right">
          <advFSItem
            :desc="$t('freeSearchInput.advancedOptions.spaceDescription')"
            class="space"
            @click="toggleShowMore(2)"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(2)"
                :title="$t('freeSearchInput.advancedOptions.spaceTitle')"
              >
                <template #input style="input">
                  <div class="outer-space-inp">
                    <input
                      class="space-input"
                      type="text"
                      v-model="userDefaultSpace"
                      @click.stop
                      @input.stop="setDefSpace"
                    />
                  </div>
                </template>
              </itemGeneral>
            </template>
            <template #checks>
              <div class="list-content-adv">
                <div
                  class="word-container"
                  v-for="(word, i) in getWords"
                  :key="word.id"
                >
                  <div class="flex flex-align-center dir-ltr">
                    <input
                      class="space-input"
                      :value="word.concat ? 1 : word.space"
                      type="text"
                      v-if="i < getWords.length - 1"
                      @input="changeSpace($event, word.id)"
                    />
                    <span class="text">{{ word.w }}</span>
                  </div>
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">{30}</div>
        </div>
      </div>

      <!-- מילים חילופיות -->

      <div class="row">
        <div class="right">
          <advFSItem
            :desc="$t('freeSearchInput.advancedOptions.altDescription')"
            @click="toggleShowMore(4)"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(4)"
                :title="$t('freeSearchInput.advancedOptions.altTitle')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    @change="checkAllOfAllWords($event, 'nirdafot')"
                    :checked="globalCheck['nirdafot']"
                    :minus="globalMinus['nirdafot']"
                    :class="{ 'check-minus': globalMinus['nirdafot'] }"
                  />
                </template>
              </itemGeneral>
              <div></div>
            </template>
            <template #checks>
              <div>
                <div class="list-content-adv">
                  <div class="flex-column">
                    <div class="flex-row">
                      <div
                        class="alt-word-container"
                        v-for="(word, j) in getWords"
                        :key="word.id"
                      >
                        <div class="flex dir-rtl text-color mrg-b-6 padd-r-3">
                          <!-- <baseCheckBox
                            class="check-item check-larg"
                            size="larg"
                            :checked="
                              word.altWords.filter((a) => a.checked).length ==
                                word.altWords.length && word.altWords.length > 0
                            "
                            @change="checkAllWords($event, word.id, 'nirdafot')"
                          /> -->

                          <span class="text font-w-m text-a-center">{{
                            word.w
                          }}</span>
                        </div>
                        <div
                          class="alt-container"
                          v-for="(altWord, i) in word.altWords"
                          :key="altWord.word + i"
                        >
                          <baseCheckBox
                            class="check-item check-larg"
                            size="larg"
                            :checked="altWord.checked"
                            @change="
                              checkAltWord($event, word.id, altWord.word)
                            "
                          />

                          <span class="text">{{ altWord.word }}</span>

                          <div
                            v-kiosk
                            v-tooltip="{
                              content: $t('advFreeSearch1.saveMyAlt'),
                              placement: 'right',
                            }"
                            v-if="showSave(altWord)"
                            @click="saveAltWord(word.w, altWord.word)"
                            class="v-btn mrg-r-3 icon-circle otz-icon icon-bg"
                          >
                            A
                          </div>

                          <div
                            v-kiosk
                            v-tooltip="{
                              content: $t('advFreeSearch1.deleteMyAlt'),
                              placement: 'right',
                            }"
                            v-if="
                              altWord.user &&
                                altWord.id1 != undefined &&
                                altWord.id2 != undefined
                            "
                            @click="deleteAltWord(altWord, j, i)"
                            class="x-btn mrg-r-3 icon-circle otz-icon icon-bg"
                          >
                            F
                          </div>
                        </div>
                        <div
                          v-kiosk
                          class="alt-word-add circle"
                          @click="openAddAltWord(word.id)"
                        >
                          <span>+</span>
                        </div>
                      </div>
                    </div>
                    <div class="word-alt-add" v-if="addAltOpen">
                      <baseInputAndBtn
                        @click="addAltWord"
                        :text="$t('freeSearchInput.advancedOptions.altOption6')"
                        :placeholder="
                          $t('freeSearchInput.advancedOptions.altOption5')
                        "
                      />
                    </div>
                    <div class="bold text-color" style="height:15px">
                      {{ errorMessage }}
                    </div>
                  </div>
                </div>
                <!--   <div
                  class="list-content-adv list-double-word padd-t-12 mrg-t-6 border-t-light"
                >
                  <div class="flex-column">
                    <div class="flex-row">
                      <div
                        class="alt-word-container"
                        v-for="word in getWords"
                        :key="word.id"
                      >
                        <div class="flex dir-rtl">
                          <baseCheckBox
                            class="check-item check-larg"
                            size="larg"
                            :checked="
                              word.altWords.filter((a) => a.checked).length ==
                                word.altWords.length && word.altWords.length > 0
                            "
                            @change="checkAllWords($event, word.id, 'nirdafot')"
                          />

                          <span class="text font-w-m text-a-center">{{
                            word.w
                          }}</span>
                        </div>
                        <div
                          class="alt-container"
                          v-for="altWord in word.altWords"
                          :key="altWord.word"
                        >
                          <baseCheckBox
                            class="check-item check-larg"
                            size="larg"
                            :checked="altWord.checked"
                            @change="
                              checkAltWord($event, word.id, altWord.word)
                            "
                          />

                          <span class="text">{{ altWord.word }}</span>

                          <div
                            v-tooltip="{
                              content: $t('advFreeSearch1.saveMyAlt'),
                              placement: 'right',
                            }"
                            v-if="showSave(altWord)"
                            @click="saveAltWord(word.w, altWord.word)"
                            class="v-btn mrg-r-3 icon-circle otz-icon icon-bg"
                          >
                            A
                          </div>

                          <div
                            v-tooltip="{
                              content: $t('advFreeSearch1.deletMyAlt'),
                              placement: 'right',
                            }"
                            v-if="
                              altWord.user &&
                                altWord.id1 != undefined &&
                                altWord.id2 != undefined
                            "
                            @click="deleteAltWord(altWord)"
                            class="x-btn mrg-r-3 icon-circle otz-icon icon-bg"
                          >
                            F
                          </div>
                        </div>
                        <div
                          class="alt-word-add circle"
                          @click="openAddAltWordDouble(word.id)"
                        >
                          <span>+</span>
                        </div>
                      </div>
                    </div>
                    <div class="word-alt-add" v-if="addAltOpenD">
                      <baseInputAndBtn
                        @click="addAltWord"
                        :text="$t('freeSearchInput.advancedOptions.altOption6')"
                        :placeholder="
                          $t('freeSearchInput.advancedOptions.altOption5')
                        "
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="!addingNewAlt"
                  class="add-new-alt flex-center flex-align-center padd-t-12 border-t-light mrg-t-12 flex"
                >
                  {{ $t("freeSearchInput.advancedOptions.addNewAltWord") }}
                  <baseButton
                    class="mrg-r-12 rtl  "
                    @click="openNewAltWord"
                  >
                    {{ $t("general.add") }}
                  </baseButton>
                </div>
                <div
                  class="flex padd-t-12 border-t-light mrg-t-12"
                  v-if="addingNewAlt"
                >
                  <input
                    class="input-border"
                    type="text"
                    :placeholder="
                      $t('freeSearchInput.advancedOptions.basicWord')
                    "
                  />
                  <input
                    class="input-border"
                    type="text"
                    :placeholder="$t('freeSearchInput.advancedOptions.altWord')"
                  />
                  <div class="flex">
                    <baseButton class="rtl  " @click="addNewAltWord">
                      {{ $t("general.add") }}
                    </baseButton>
                    <baseButton
                      class="rtl  "
                      @click="closeAddNewAltWord"
                    >
                      {{ $t("general.cancel") }}
                    </baseButton>
                  </div>
                </div> -->
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">(/)[]</div>
        </div>
      </div>

      <!-- ראשי תיבות -->
      <template v-if="false">
        <div class="row">
          <div class="right">
            <advFSItem
              @click="toggleShowMore(11)"
              :desc="$t('freeSearchInput.advancedOptions.altOption4')"
            >
              <template #description>
                <itemGeneral
                  :showDesc="showThis(11)"
                  :title="$t('freeSearchInput.advancedOptions.RTTitle')"
                >
                  <template #input style="input">
                    <baseCheckBox
                      class="check-item"
                      size="main_2"
                      @change="checkAllOfAllWords($event, 'rt')"
                      :checked="globalCheck['rt']"
                      :minus="globalMinus['rt']"
                      :class="{ 'check-minus': globalMinus['rt'] }"
                    />
                  </template>
                </itemGeneral>
              </template>
              <template #checks>
                <div>
                  <div class="list-content-adv">
                    <div class="flex-column">
                      <div class="flex-row">
                        <div
                          class="alt-word-container"
                          v-for="(word, j) in getWords"
                          :key="word.id"
                        >
                          <!-- <baseCheckBox
                          class="check-item check-larg"
                          size="larg"
                          :checked="
                            word.rtWords.filter((a) => a.checked).length ==
                              word.rtWords.length && word.rtWords.length > 0
                          "
                          @change="checkAllWords($event, word.id, 'rt')"
                        /> -->

                          <span
                            class="text font-w-m text-a-center  text-color mrg-b-6 padd-r-3"
                            >{{ word.w }}</span
                          >

                          <div
                            class="alt-container"
                            v-for="(altWord, i) in word.rtWords"
                            :key="altWord.word + i"
                          >
                            <baseCheckBox
                              class="check-item check-larg"
                              size="larg"
                              :checked="altWord.checked"
                              @change="
                                checkRTWord($event, word.id, altWord.word)
                              "
                            />

                            <span class="text">{{ altWord.word }}</span>

                            <div
                              v-tooltip="{
                                content: $t('advFreeSearch1.saveMyAlt'),
                                placement: 'right',
                              }"
                              v-if="showSave(altWord)"
                              @click="saveAltWord(word.w, altWord.word, 2)"
                              class="v-btn mrg-r-3 icon-circle otz-icon icon-bg"
                            >
                              A
                            </div>

                            <div
                              v-tooltip="{
                                content: $t('advFreeSearch1.deleteMyAlt'),
                                placement: 'right',
                              }"
                              v-if="showDelete(altWord)"
                              @click="deleteAltWord(altWord, j, i, 2)"
                              class="x-btn mrg-r-3 icon-circle otz-icon icon-bg"
                            >
                              F
                            </div>
                          </div>

                          <div
                            class="alt-word-add circle"
                            @click="openAddRTWord(word.id)"
                          >
                            <span>+</span>
                          </div>
                        </div>
                      </div>
                      <div class="word-alt-add" v-if="addRTOpen">
                        <baseInputAndBtn
                          @click="adRTWord"
                          :text="
                            $t('freeSearchInput.advancedOptions.altOption6')
                          "
                          :placeholder="
                            $t('freeSearchInput.advancedOptions.altOption7')
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <!--                 <div
                  class="list-content-adv list-double-word padd-t-12 mrg-t-6 border-t-light"
                >
                  <div class="flex-column">
                    <div class="flex-row">
                      <div
                        class="alt-word-container"
                        v-for="word in getWords"
                        :key="word.id"
                      >
                        <baseCheckBox
                          class="check-item check-larg"
                          size="larg"
                          :checked="
                            word.rtWords.filter((a) => a.checked).length ==
                              word.rtWords.length && word.rtWords.length > 0
                          "
                          @change="checkAllWords($event, word.id, 'rt')"
                        />

                        <span class="text font-w-m text-a-center">{{
                          word.w
                        }}</span>

                        <div
                          class="alt-container"
                          v-for="altWord in word.rtWords"
                          :key="altWord.word"
                        >
                          <baseCheckBox
                            class="check-item check-larg"
                            size="larg"
                            :checked="altWord.checked"
                            @change="checkRTWord($event, word.id, altWord.word)"
                          />

                          <span class="text">{{ altWord.word }}</span>

                          <div
                            v-tooltip="{
                              content: $t('advFreeSearch1.saveMyAlt'),
                              placement: 'right',
                            }"
                            v-if="showSave(altWord)"
                            @click="saveAltWord(word.w, altWord.word, 2)"
                            class="v-btn mrg-r-3 icon-circle otz-icon icon-bg"
                          >
                            A
                          </div>

                          <div
                            v-tooltip="{
                              content: $t('advFreeSearch1.deleteMyAlt'),
                              placement: 'right',
                            }"
                            v-if="showDelete(altWord)"
                            @click="deleteAltWord(altWord, 2)"
                            class="x-btn mrg-r-3 icon-circle otz-icon icon-bg"
                          >
                            F
                          </div>
                        </div>
                        <div
                          class="alt-word-add circle"
                          @click="openAddRTWord(word.id)"
                        >
                          <span>+</span>
                        </div>
                      </div>
                    </div>
                    <div class="word-alt-add" v-if="addRTOpen">
                      <baseInputAndBtn
                        @click="adRTWord"
                        :text="$t('freeSearchInput.advancedOptions.altOption6')"
                        :placeholder="
                          $t('freeSearchInput.advancedOptions.altOption7')
                        "
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="!addingNewRT"
                  class="add-new-alt flex-center flex-align-center padd-t-12 border-t-light mrg-t-12 flex "
                >
                  {{ $t("freeSearchInput.advancedOptions.addNewRT") }}
                  <baseButton
                    class="mrg-r-12 rtl  "
                    @click="openNewRTWord"
                  >
                    {{ $t("general.add") }}
                  </baseButton>
                </div>
                <div
                  class="flex  padd-t-12 border-t-light mrg-t-12"
                  v-if="addingNewRT"
                >
                  <input
                    class="input-border"
                    type="text"
                    :placeholder="
                      $t('freeSearchInput.advancedOptions.basicWord')
                    "
                  />
                  <input
                    class="input-border"
                    type="text"
                    :placeholder="$t('freeSearchInput.advancedOptions.altWord')"
                  />
                  <div class="flex ">
                    <baseButton class="rtl  " @click="addNewRT">
                      {{ $t("general.add") }}
                    </baseButton>
                    <baseButton class="rtl  " @click="closeAddNewRT">
                      {{ $t("general.cancel") }}
                    </baseButton>
                  </div>
                </div> -->
                </div>
              </template>
            </advFSItem>
          </div>
          <div class="left flex-column">
            <div class="short-key-icon">^</div>
          </div>
        </div>
      </template>

      <!-- שלילת מילה -->

      <div class="row no-check">
        <div class="right">
          <advFSItem
            :desc="$t('freeSearchInput.advancedOptions.negDescription')"
            @click="toggleShowMore(3)"
            style=""
          >
            <template #description>
              <itemGeneral
                class="neg-word"
                :showDesc="showThis(3)"
                :title="$t('freeSearchInput.advancedOptions.negTitle')"
              ></itemGeneral>
            </template>
            <template #checks>
              <negWords :words="getNegWords" @update="noWordsChange" />
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">--</div>
        </div>
      </div>
      <!-- השלמת מילה -->

      <div class="row complet-word  no-check">
        <div class="right">
          <advFSItem
            :desc="$t('freeSearchInput.advancedOptions.completeDescription')"
            @click="toggleShowMore(5)"
            style=""
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(5)"
                :title="$t('freeSearchInput.advancedOptions.completeTitle')"
              ></itemGeneral>
            </template>

            <template #checks>
              <div class="list-content-adv flex">
                <!-- <baseInput /> -->

                <div class="desc mrg-b-3">
                  {{
                    $t(
                      "freeSearchInput.advancedOptions.completeDescriptionShort"
                    )
                  }}
                </div>

                <div class="error mrg-b-3">{{ completeWordError }}</div>
                <div class="flex flex-wrap">
                  <input
                    v-for="word in getWords"
                    :key="word.id"
                    type="text"
                    class="input-complete input-border mrg-b-6"
                    :value="word.w"
                    @input="setWord($event.target.value, word.id)"
                  />
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">*,?,!</div>
        </div>
      </div>

      <!-- תיקוני OCR -->

      <div class="row">
        <div class="right ocr">
          <advFSItem :arrow="false">
            <template #description>
              <itemGeneral
                :showDesc="showThis(7)"
                :title="$t('freeSearchInput.advancedOptions.OCRTitle')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    :checked="getOCR"
                    @change="setMoreOptions($event, 1)"
                  />
                </template>
              </itemGeneral>
            </template>
            <template #checks>
              <div class="flex-column">
                <div>
                  {{ $t("freeSearchInput.advancedOptions.altOption2") }}
                </div>
                <div class="message-small">
                  {{ $t("freeSearchInput.advancedOptions.altOption2_2") }}
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">#</div>
        </div>
      </div>

      <!-- מילים נרדפות -->
      <!--   <div class="row">
        <div class="right">
          <advFSItem @click="toggleShowMore(10)">
            <template #description>
              <itemGeneral
                :showDesc="showThis(10)"
                :title="$t('freeSearchInput.advancedOptions.nirdafotTitle')"
                :desc="$t('freeSearchInput.advancedOptions.altOption1')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    @change="checkAll($event, 'nirdafot')"
                    :checked="globalCheck['nirdafot']"
                    :minus="globalMinus['nirdafot']"
                    :class="{ 'check-minus': globalMinus['nirdafot'] }"
                  />
                </template>
              </itemGeneral>
            </template>
            <template #checks v-if="showThis(10)">
              <div class="list-content-adv">

                <div
                  class="word-container"
                  v-for="word in getWords"
                  :key="word.id"
                >
                  <baseCheckBox
                    class="check-item check-larg space-left"
                    :checked="word['nirdafot']"
                    @change="
                      checkCurrent($event.target.checked, word.id, 'nirdafot')
                    "
                    size="larg"
                  />

                  <span class="text">{{ word.w }}</span>
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">~</div>
        </div>
      </div> -->

      <!-- ראשי תיבות -->
      <!-- <div class="row">
        <div class="right">
          <advFSItem @click="toggleShowMore(11)">
            <template #description>
              <itemGeneral
                :showDesc="showThis(11)"
                :title="$t('freeSearchInput.advancedOptions.RTTitle')"
                :desc="$t('freeSearchInput.advancedOptions.altOption4')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    @change="checkAll($event, 'rt')"
                    :checked="globalCheck['rt']"
                    :minus="globalMinus['rt']"
                    :class="{ 'check-minus': globalMinus['rt'] }"
                  />
                </template>
              </itemGeneral>
            </template>
            <template #checks v-if="showThis(11)">
              <div class="list-content-adv">

                <div
                  class="word-container"
                  v-for="word in getWords"
                  :key="word.id"
                >
                  <baseCheckBox
                    class="check-item check-larg space-left"
                    :checked="word['rt']"
                    @change="checkCurrent($event.target.checked, word.id, 'rt')"
                    size="larg"
                  />

                  <span class="text">{{ word.w }}</span>
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">^</div>
        </div>
      </div> -->

      <!-- כתיב מלא וחסר -->
      <div class="row">
        <div class="right">
          <advFSItem
            :desc="$t('freeSearchInput.advancedOptions.altOption3')"
            @click="toggleShowMore(9)"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(9)"
                :title="$t('freeSearchInput.advancedOptions.MCTitle')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    @change="checkAll($event, 'mc')"
                    :checked="globalCheck['mc']"
                    :minus="globalMinus['mc']"
                    :class="{ 'check-minus': globalMinus['mc'] }"
                  />
                </template>
              </itemGeneral>
            </template>
            <template #checks>
              <div class="list-content-adv">
                <!-- <span class="separator"></span> -->
                <div
                  class="word-container"
                  v-for="word in getWords"
                  :key="word.id"
                >
                  <baseCheckBox
                    class="check-item check-larg space-left check-padd-0"
                    :checked="word['mc']"
                    @change="checkCurrent($event.target.checked, word.id, 'mc')"
                    size="larg"
                  />

                  <span class="text">{{ word.w }}</span>
                </div>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">@</div>
        </div>
      </div>

      <!-- חיפוש בעמודים ראשונים -->
      <div class="row">
        <div class="right">
          <advFSItem
            :arrow="false"
            :desc="$t('freeSearchInput.advancedOptions.ShaarTitle')"
            @click="toggleShowMore(9)"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(9)"
                :title="$t('freeSearchInput.advancedOptions.ShaarTitle')"
              >
                <template #input style="input">
                  <baseCheckBox
                    class="check-item"
                    size="main_2"
                    :checked="getFP"
                    @change="setMoreOptions($event, 5)"
                  />
                </template>
              </itemGeneral>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">|</div>
        </div>
      </div>

      <!-- חיפוש נוסף-->
      <!--
      <div class="row">
        <div class="right">
          <advFSItem
            @click="toggleShowMore(6)"
            class="add-search"
            style="padding-right:43px;"
          >
            <template #description>
              <itemGeneral
                :showDesc="showThis(6)"
                :title="$t('freeSearchInput.advancedOptions.anotherTitle')"
                :desc="$t('freeSearchInput.advancedOptions.anotherDescription')"
              ></itemGeneral>
            </template>
            <template #checks v-if="showThis(6)">
              <div class="input-add-search">
                <input type="text" class="input-border full-w mrg-b-3" />

                <baseButton style="width:110px">+ הוסף חיפוש</baseButton>
              </div>
            </template>
          </advFSItem>
        </div>
        <div class="left flex-column">
          <div class="short-key-icon">++</div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Vue from "vue";
import advFSItem from "./advFSItem.vue";
import itemGeneral from "./itemGeneral.vue";
import negWords from "./negWords.vue";
const DEFSPACE = 30;
let altCheckedWords = [];
let rtCheckedWords = [];
export default {
  components: {
    advFSItem,
    itemGeneral,
    negWords,
  },
  data() {
    return {
      userDefaultSpace: this.getGlobalSpace,
      addAltOpen: false,
      addAltOpenD: false,
      addRTOpen: false,
      wordIndex: 0,
      completeWordError: "",
      addingNewAlt: false,
      addingNewRT: false,
      errorMessage: "",
    };
  },
  props: ["showMore", "globalCheck", "globalMinus"],
  computed: {
    ...mapGetters("freeSearch", [
      "getSearchWords",
      "getSearchWords1",
      "getSearchString",
    ]),
    getWords() {
      let react = this.$store.state.userAltWords.altWords;
      this.words = this.getSearchWords.words;
      //  this.words = this.getSearchWords1().words;
      this.mergeWithCompData();
      return this.words;
    },
    getGlobalSpace() {
      return this.getSearchWords.globalSpace;
    },
    getNegWords() {
      return this.getSearchWords.no;
    },
    getNirdafot() {
      return this.getSearchWords.nirdafot;
    },
    getOCR() {
      return this.getSearchWords.ocr;
    },
    getFP() {
      return this.getSearchWords.firstPages;
    },
    getOrder() {
      return this.getSearchWords.order;
    },
    getMC() {
      return this.getSearchWords.malechaser;
    },
    getRT() {
      return this.getSearchWords.rasheitevot;
    },
    allChecked(id, type) {
      if (type == "nirdafot")
        return (
          this.getWords[id].altWords.filter((a) => a.checked).length ==
          this.getWords[id].altWords.length
        );
      else
        return (
          this.getWords[id].rtWords.filter((a) => a.checked).length ==
          this.getWords[id].rtWords.length
        );
    },
  },
  methods: {
    ...mapActions("freeSearchBookList", ["setInputTxt"]),
    ...mapActions("userAltWords", ["addUserAltWord", "delUserAltWord"]),
    ...mapActions("freeSearch", [
      "setSearchString",
      "createSearchTxtFromArray",
    ]),
    saveAltWord(mainWord, altWord, type = 1) {
      this.addUserAltWord({ word1: mainWord, word2: altWord, type });
    },
    deleteAltWord(altWord, wordId, altWordId, type = 1) {
      let id1 = altWord.id1,
        id2 = altWord.id2;
      let words = type == 1 ? altCheckedWords : rtCheckedWords;
      delete words[wordId].words[altWordId].id1;
      delete words[wordId].words[altWordId].id2;

      this.delUserAltWord({ id1, id2 });
    },
    filterByCatg($event) {},
    openAddAltWord(id) {
      this.addAltOpen = true;
      this.wordIndex = id;
    },
    openAddAltWordDouble(id) {
      this.addAltOpenD = true;
      this.wordIndex = id;
    },
    openAddRTWord(id) {
      this.addRTOpen = true;
      this.wordIndex = id;
    },

    adRTWord(event, word) {
      /*  this.words[this.wordIndex].altWords.splice(
        this.words[this.wordIndex].altWords.length,
        1,
        {
          checked: true,
          word,
          user: true,
        }
      ); */
      let altWords = this.words[this.wordIndex].rtWords;
      altWords.push({
        checked: true,
        word,
        user: true,
      });
      Vue.set(this.words[this.wordIndex], "rtWords", altWords);
      /*  this.words[this.wordIndex].altWords.push({
        checked: true,
        word,
        user: true,
      }); */
      // this.updateSearchTxt();
      this.addRTOpen = false;
    },

    addAltWord(event, word) {
      /*  this.words[this.wordIndex].altWords.splice(
        this.words[this.wordIndex].altWords.length,
        1,
        {
          checked: true,
          word,
          user: true,
        }
      ); */
      if (word.indexOf(" ") > -1) {
        this.errorMessage = this.$t(
          "freeSearchInput.advancedOptions.addSingleWord"
        );
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
        return;
      }
      let altWords = this.words[this.wordIndex].altWords;
      altWords.push({
        checked: true,
        word,
        user: true,
      });
      Vue.set(this.words[this.wordIndex], "altWords", altWords);
      /*  this.words[this.wordIndex].altWords.push({
        checked: true,
        word,
        user: true,
      }); */
      //this.updateSearchTxt();
      this.addAltOpen = false;
      this.addAltOpenD = false;
    },
    showSave(altWord) {
      return altWord.user & !altWord.id1 & !altWord.id2;
    },
    showDelete(altWord) {
      return (
        altWord.user && altWord.id1 != undefined && altWord.id2 != undefined
      );
    },
    showSpace(i, w) {
      return (i > 0) & (w.space != DEFSPACE);
    },
    toggleShowMore(index) {
      this.showMore.splice(index, 1, !this.showMore[index]);
    },
    showThis(index) {
      return this.showMore[index];
    },
    updateSearchTxt() {
      let moreOptions = [
        this.getOrder,
        this.getOCR,
        this.getRT,
        this.getNirdafot,
        this.getMC,
        this.getFP,
      ];
      this.createSearchTxtFromArray({
        words: this.words,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
      });
    },
    checkCurrent(value, index, option) {
      this.getWords[index][option] = value;
      let moreOptions = [
        this.getOrder,
        this.getOCR,
        this.getRT,
        this.getNirdafot,
        this.getMC,
        this.getFP,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
        this.$emit("global_change", {
          option,
          value: this.checkChecked(option),
        });
        this.$emit("minus_change", { option, value: this.checkMinus(option) });
        // this.globalCheck[option] = this.checkChecked(option);
        // this.globalMinus[option] = this.checkMinus(option);
      });
    },
    checkAltWord(e, id, word) {
      this.getWords[id].altWords.forEach((w, j) => {
        if (w.word == word) {
          this.words[id].altWords[j].checked = e.target.checked; // w.checked = e.target.checked;

          //save alt words in component
          altCheckedWords[id].words[j].checked = e.target.checked;
        }
      });

      this.updateSearchTxt();
    },
    checkRTWord(e, id, word) {
      this.getWords[id].rtWords.forEach((w, j) => {
        if (w.word == word) {
          this.words[id].rtWords[j].checked = e.target.checked; // w.checked = e.target.checked;

          //save alt words in component
          rtCheckedWords[id].words[j].checked = e.target.checked;
        }
      });
      this.updateSearchTxt();
    },
    mergeWithCompData() {
      let rtCompArr = [],
        altCompArr = [];

      this.words.forEach((item) => {
        let found = altCheckedWords.filter((a) => a.word == item.w);
        if (found.length > 0) {
          found[0].words.forEach((aword, i) => {
            let foundAltWord = item.altWords.filter(
              (a) => a.word == aword.word
            );
            if (foundAltWord.length > 0)
              foundAltWord[0].checked = aword.checked;
            //  item.altWords[i].checked = foundAltWord[0].checked;
            else item.altWords.push(aword);
          });

          // item.altWords = found[0].words;
        }
        altCompArr.push({ word: item.w, words: item.altWords });

        let foundRt = rtCheckedWords.filter((a) => a.word == item.w);
        if (foundRt.length > 0) item.rtWords = foundRt[0].words;
        rtCompArr.push({ word: item.w, words: item.rtWords });
      });

      altCheckedWords = altCompArr;
      rtCheckedWords = rtCompArr;
    },
    checkAllWords(e, id, option) {
      if (option == "nirdafot")
        this.getWords[id].altWords.forEach((w) => {
          w.checked = e.target.checked;
        });
      else
        this.getWords[id].rtWords.forEach((w) => {
          w.checked = e.target.checked;
        });
    },
    checkAllOfAllWords(e, option) {
      this.getWords.forEach((word) => {
        let rt = word.rtWords;
        let alt = word.altWords;
        if (option == "nirdafot")
          alt.forEach((w) => {
            w.checked = e.target.checked;
          });
        else
          rt.forEach((w) => {
            w.checked = e.target.checked;
          });
      });
      this.$emit("global_change", { option, value: e.target.checked });
      this.$emit("minus_change", { option, value: false });
    },
    checkAll(e, option) {
      this.getWords.forEach((w) => {
        w[option] = e.target.checked;
      });
      let moreOptions = [
        this.getOrder,
        this.getOCR,
        this.getRT,
        this.getNirdafot,
        this.getMC,
        this.getFP,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt);
        this.setInputTxt(txt);
        this.$emit("global_change", { option, value: e.target.checked });
        this.$emit("minus_change", { option, value: false });
        //this.globalCheck[option] = e.target.checked;
        //this.globalMinus[option] = false;
      });
    },
    checkChecked(option) {
      let checked = this.getWords.filter((w, i) => w[option] === true);
      let lengthToCheck = checked.length;
      if (option == "concat") lengthToCheck--;
      if (lengthToCheck > 0) return true;

      return false;
    },
    checkMinus(option) {
      let length = this.getWords.filter((w, i) => w[option] == true).length;

      let lengthToCheck = this.getWords.length;
      if (option == "concat") lengthToCheck--;
      if ((length < lengthToCheck) & (length > 0)) return true;
      return false;
    },
    noWordsChange(noW) {
      let moreOptions = [
        this.getOrder,
        this.getOCR,
        this.getRT,
        this.getNirdafot,
        this.getMC,
        this.getFP,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: noW,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
      });
    },
    changeSpace(event, index) {
      let newSpace;
      try {
        newSpace = parseInt(event.target.value);
        if (!isNaN(newSpace)) {
          this.getWords[index]["space"] = newSpace;
          if (newSpace > 1) this.getWords[index]["concat"] = false;
          else this.getWords[index]["concat"] = true;
          let moreOptions = [
            this.getOrder,
            this.getOCR,
            this.getRT,
            this.getNirdafot,
            this.getMC,
            this.getFP,
          ];
          this.createSearchTxtFromArray({
            words: this.getWords,
            moreOptions,
            no: this.getNegWords,
            globalSpace: this.getGlobalSpace,
          }).then((txt) => {
            this.setSearchString(txt.trim());
            this.setInputTxt(txt.trim());
          });
        }
      } catch (ex) {}
    },
    setDefSpace($event) {
      let newSpace = parseInt($event.target.value);
      if (!isNaN(newSpace)) {
        this.getWords.forEach((w) => {
          w["space"] = newSpace;
        });
        let moreOptions = [
          this.getOrder,
          this.getOCR,
          this.getRT,
          this.getNirdafot,
          this.getMC,
          this.getFP,
        ];
        this.createSearchTxtFromArray({
          words: this.getWords,
          moreOptions,
          no: this.getNegWords,
          globalSpace: this.getGlobalSpace,
        }).then((txt) => {
          this.setSearchString(txt.trim());
          this.setInputTxt(txt.trim());
        });
      }
    },
    setWord(newWord, id) {
      if (!this.validateWord(newWord)) {
        this.completeWordError = this.$t(
          "freeSearchInput.noAddMoreOneCharacter"
        );
        return true;
      }
      this.completeWordError = "";
      this.getWords[id].w = newWord;
      let moreOptions = [
        this.getOrder,
        this.getOCR,
        this.getRT,
        this.getNirdafot,
        this.getMC,
        this.getFP,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
      });
    },
    setOrder($event) {
      let moreOptions = [
        $event.target.checked,
        this.getOCR,
        this.getRT,
        this.getNirdafot,
        this.getMC,
        this.getFP,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
      });
    },
    setMoreOptions($event, option) {
      let moreOptions = [
        this.getOrder,
        this.getOCR,
        this.getRT,
        this.getNirdafot,
        this.getMC,
        this.getFP,
      ];
      moreOptions[option] = $event.target.checked;
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
      });
    },
    validateWord(word) {
      let foundSpecChars = 0;
      if (word.indexOf("*") > -1) foundSpecChars++;
      if (word.indexOf("!") > -1) foundSpecChars++;
      if (word.indexOf("?") > -1) foundSpecChars++;
      return foundSpecChars < 2;
    },
    showFSHelp() {
      const helpFile = globalThis.ELECTRON_ENV
        ? "mainMenu.helpFileNameElectron"
        : "mainMenu.helpFileName";
      window.open(`${this.$t(helpFile)}#page=14`);
    },
    openNewAltWord() {
      this.addingNewAlt = true;
    },
    closeAddNewAltWord() {
      this.addingNewAlt = false;
    },
    addNewAltWord() {
      this.addingNewAlt = false;
    },
    openNewRTWord() {
      this.addingNewRT = true;
    },
    closeAddNewRT() {
      this.addingNewRT = false;
    },
    addNewRT() {
      this.addingNewRT = false;
    },
  },

  created() {
    this.userDefaultSpace = this.getGlobalSpace;
  },
};
</script>
<style lang="scss" scoped>
$border: #d4d4d4;
$bg-color5: #f4f4f4;
.input-complete {
  width: 110px;
}
.right {
  flex-basis: 85%;
  border-left: $border 1px solid;

  width: calc(100% - 80px);
  overflow: auto;
}
.left {
  background-color: $bg-color5;
  // padding-right: 20px;
  flex-grow: 1;
  width: 79px;
}

.bottom-advanced {
  display: flex;
  flex-direction: row;
}
.container-adv-popup {
  display: flex;
  flex-direction: column;
  height: calc(100% - 64px);
}

.row {
  display: flex;
  flex-direction: row;

  border-bottom: $border 1px solid;
}
.alt-container {
  display: flex;
  flex-direction: row;
  line-height: 24px;
  text-align: right;
  // margin-bottom: 4px;
  justify-content: space-between;
  .text {
    flex-grow: 1;
  }
}
.alt-word-add {
  width: 20.3px;
  height: 20.3px;
  line-height: 22.3px;
  text-align: center;
  background-color: $bg-color5;
  border-radius: 50%;
  font-size: 17px;
  font-weight: bold;
  color: #7b7b7b;
  margin-left: auto;
  margin-top: 4px;
  &:hover {
    background-color: #dedede;
  }
  .check-item {
    padding-right: 0;
    padding-left: 5px;
    width: 19px;
  }
}

.word-container {
  display: flex;
  flex-direction: row;
  margin-left: 8px;
}
.alt-word-container {
  display: flex;
  flex-direction: column;
  // width: 104px;
  padding: 0 3px 0 6px;
  // border-left: 1px solid $border;
  padding-left: 30px;
}
.title-header {
  padding: 0 42px !important;
}
.learn-more {
  width: 60px;
  height: 25px;
  text-align: center;
  background-color: var(--custom-color1);
  border-radius: 17px;
  padding: 0 10px;
  font-size: 10px;
  border: 1px solid #dedede;
  line-height: 25px;
  margin-left: 6px;
  color: white;
  margin: 0 auto;
  background-color: var(--custom-color1);
  font-weight: 400;
  height: 18px;
  line-height: 16px;
  width: 45px;
  padding: 0;
  cursor: pointer;
  &:hover,
  &.active {
    background-color: var(--custom-color1);
  }
}

.flex-column {
  display: flex;
  flex-direction: column;
  position: relative;
}
.short-key-icon {
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: #7b7b7b;
  text-align: center;
  width: 100%;
  /* height: 100%; */
  top: 50%;
  transform: translateY(-50%);
  &.first-short {
    top: 45px;
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 11px;
}
.input {
  padding-right: 30px;
  padding-left: 30px;
}

.list-content-adv {
  padding: 0 40px 0 0;
  display: flex;
  flex-direction: row;
  align-items: self-end;
  font-weight: 500;
}

.space-input {
  width: 24.5px;
  height: 14.5px;
  border: 1.5px #b2b2b2 solid;
  background-color: $bg-color5;
  border-radius: 1.5px;
  margin: 1.5px -0.5px 5px 8px;
  text-align: center;
  line-height: 0px;
  font-size: 13px;
  display: block;
  color: var(--custom-color1);

  &:hover {
    border-color: #7b7b7b;
  }
  color: var(--custom-color1);
}
.word-container {
  .space-input {
    font-size: 12px;
    color: var(--custom-color1);
    line-height: 10px;
    margin: 3px 3px;
    margin-right: 8px;
    border-color: $border;
    &:hover {
      border-color: #b2b2b2;
    }
  }
}
.options-container {
  // max-width: calc(100% - 70px);
  overflow: hidden;
  overflow: auto;
  &.list-content-adv {
    padding: 0 40px;
  }
}
.check-option {
  display: flex;
  flex-direction: row;
  // border-top: solid 1px gray;

  padding-bottom: 11px;
  padding-top: 11px;
  border-top: 1px solid $border;
}
.message-small {
  font-size: 13px;
  color: #b2b2b2;
  line-height: 14px;
}
.item-container .list-content-adv .concat.check-item {
  padding: 0 8px;
  width: 29.5px;
}
.more-options {
  padding-right: 0;
  line-height: 24px;
  .check-item {
    padding-right: 0;
    padding-left: 10px;
  }
}
.complet-word {
  .combo-complete {
    width: 132px;
  }
  .list-content-adv {
    padding-right: 13px;
    display: block;
  }
}
.input-complet {
  width: 159px;
  height: 39px;
  border-radius: 20px;
  border: 1px solid $border;
  padding: 0 41px;
}
.add-complet-word {
  display: flex;
  margin-left: 19px;
  span {
    width: 190px;
  }
}
.complet-input {
  position: relative;
  margin: 25px 0 20px 0;
  width: 159px;
  .btn-complet {
    width: 35px;
    height: 39px;
    border-radius: 0 20px 20px 0;
    border: 1px solid #000;
    padding: 0;
    position: absolute;
    padding: 0;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    line-height: 33px;
    &.btn-complet-right {
    }
    &.btn-complet-left {
      left: 0;
      border-radius: 20px 0 0 20px;
      top: 0;
    }
  }
}
.container-add-complet-word {
  .add-complet-word {
  }
}
.item-container .list-content-adv .concat.check-item {
  padding: 0 8px;
  width: 29.5px;
}
.error {
  color: red !important;
}
</style>
