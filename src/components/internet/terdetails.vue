<!--
 * @Description: 
 * @Author: 
 * El Psy Congroo
-->
<template>
	<el-container class="have-permission">
		<el-main class="box">
			<el-row class="title mt10">
				<span class="back" style="display: none"><i class="el-icon-arrow-left"></i>返回</span>
				<div class="d">
					<span class="na"
						>当前位置: <font class="na_con">{{ rows.place }}</font></span
					>
					<span class="na"
						>序列号:<font class="na_con">{{ rows.sn }}</font> &nbsp;&nbsp; IP:<font class="na_con">{{ rows.ip }}</font></span
					>
				</div>
			</el-row>
			<el-row v-if="isline">
				<!-- <el-row class="method-title mt10">
          <el-button type="primary" size="mini" @click="addMethod"
            >新增控制</el-button
          >
          <el-button
            type="warning"
            @click="methodeditor = !methodeditor"
            size="mini"
            >编辑</el-button
          >
        </el-row> -->
				<!-- done 列表 -->
				<el-collapse v-model="activeName" accordion>
					<el-collapse-item name="1" style="font-size: 16px">
						<template slot="title">
							<span v-html="'物联开关&#12288;' + listNumber(this.listSwitch)"></span>
						</template>
						<div class="light-box" v-for="item in listSwitch" :key="item.id">
							<div class="col-light">
								<span class="col-title">{{ item.name }}</span>
								<el-switch
									:disabled="item.options.isDisplay || isDisplay"
									@change="changeMainpower(item, $event)"
									v-model="item.options.status_mount_is"
								></el-switch>
								<span v-if="methodeditor">
									<el-button type="text" size="mini" class="pai" @click="changeSort(item)" v-show="!item.options.disabledIdx"
										>排序</el-button
									>
									<span v-show="item.options.disabledIdx">
										<el-input class="shux" v-model="item.idx" clearable></el-input>
										<el-button type="primary" icon="el-icon-check" size="mini" @click="trueSort(item)">保存</el-button>
										<el-button type="danger" icon="el-icon-close" size="mini" @click="trueSort(item)">取消</el-button>
									</span>
									<span class="remove el-icon-circle-close" @click="deleteMethod(item.id)"></span>
								</span>
							</div>
						</div>
					</el-collapse-item>
					<el-collapse-item name="2" class="collapse-title">
						<template slot="title">
							<span v-html="'物联按钮&#12288;' + listNumber(this.listButton)"></span>
						</template>
						<div class="main-switch light-box" v-for="item in listButton" :key="item.id">
							<div class="btn_name">
								<span class="title p_title">{{ item.name }}</span>
								<el-switch @change="modeMethod(item)" v-model="item.options.status_mount"></el-switch>
								<span v-if="methodeditor">
									<el-button type="text" size="mini" class="pai" @click="changeSort(item)" v-show="!item.options.disabledIdx"
										>排序</el-button
									>
									<span v-show="item.options.disabledIdx">
										<el-input class="shux" v-model="item.idx" clearable></el-input>
										<el-button type="primary" icon="el-icon-check" size="mini" @click="trueSort(item)">保存</el-button>
										<el-button type="danger" icon="el-icon-close" size="mini" @click="trueSort(item)">取消</el-button>
									</span>
									<span class="remove el-icon-circle-close" @click="deleteMethod(item.id)"></span>
								</span>
							</div>
							<div class="btn_option" v-for="btn in item.options.configs" :key="btn.id">
								<el-button type="primary" @click="changeButton(item, btn)" :disabled="!item.options.status_mount">{{
									btn.comment
								}}</el-button>
							</div>
						</div>
					</el-collapse-item>
					<el-collapse-item name="3" class="collapse-title">
						<template slot="title">
							<span v-html="'物联音频&#12288;' + listNumber(this.listSlider)"></span>
						</template>
						<el-row>
							<el-col :span="22" :offset="1">
								<div class="grid-content bg-purple-dark" style="overflow: visible">
									<div class="music light-box" v-for="item in listSlider" :key="item.id">
										<span class="demonstration">{{ item.name }}</span
										><el-button
											type="primary"
											icon="el-icon-turn-off-microphone"
											size="mini"
											@click="changeVolume(item, 1)"
											circle
											:disabled="!item.options.status_mount"
										></el-button>
										<el-switch @change="modeMethod(item)" v-model="item.options.status_mount"></el-switch>
										<span v-if="methodeditor">
											<el-button
												type="text"
												size="mini"
												class="pai"
												@click="changeSort(item)"
												v-show="!item.options.disabledIdx"
												>排序</el-button
											>
											<span v-show="item.options.disabledIdx">
												<el-input class="shux" v-model="item.idx" clearable></el-input>
												<el-button type="primary" icon="el-icon-check" size="mini" @click="trueSort(item)">保存</el-button>
												<el-button type="danger" icon="el-icon-close" size="mini" @click="trueSort(item)">取消</el-button>
											</span>
											<span class="remove el-icon-circle-close" @click="deleteMethod(item.id)"></span>
										</span>
										<el-slider
											tooltip-class="musictip"
											:max="87"
											v-model="item.options.music"
											@change="changeVolume(item)"
											:disabled="!item.options.status_mount"
										></el-slider>
									</div>
								</div>
							</el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item name="4" class="collapse-title">
						<template slot="title">
							<span v-html="'物联输出&#12288;' + listNumber(this.listRadio)"></span>
						</template>
						<div class="grid-content bg-purple-dark" style="overflow: visible">
							<div class="main-switch light-box" v-for="item in listRadio" :key="item.id">
								<div class="btn_name">
									<span class="title p_title">{{ item.name }}</span>
									<el-switch @change="modeMethod(item)" v-model="item.options.status_mount"></el-switch>
									<span v-if="methodeditor">
										<el-button type="text" size="mini" class="pai" @click="changeSort(item)" v-show="!item.options.disabledIdx"
											>排序</el-button
										>
										<span v-show="item.options.disabledIdx">
											<el-input class="shux" v-model="item.idx" clearable></el-input>
											<el-button type="primary" icon="el-icon-check" size="mini" @click="trueSort(item)">保存</el-button>
											<el-button type="danger" icon="el-icon-close" size="mini" @click="trueSort(item)">取消</el-button>
										</span>
										<span class="remove el-icon-circle-close" @click="deleteMethod(item.id)"></span>
									</span>
								</div>
								<div class="btn_option" v-for="radio in item.options.configs" :key="radio.id">
									<el-radio
										v-model="item.options.mun"
										@change="radioChange(item)"
										:disabled="!item.options.status_mount"
										:label="radio.attr"
										>{{ radio.comment }}</el-radio
									>
								</div>
							</div>
						</div>
					</el-collapse-item>
					<el-collapse-item name="5" class="collapse-title">
						<template slot="title">
							<span v-html="'物联环境&#12288;' + listNumber(this.listView)"></span>
						</template>
						<div class="class-environment">
							<div class="project-box" v-for="item in listView" :key="item.id">
								<div class="project">
									<p class="project-first">{{ item.name }}</p>
									<p class="project-last">
										{{ item.options.contents | viewFixed }}
									</p>
								</div>
								<span v-if="methodeditor">
									<el-button type="text" size="mini" class="pai" @click="changeSort(item)" v-show="!item.options.disabledIdx"
										>排序</el-button
									>
									<span v-show="item.options.disabledIdx">
										<el-input class="shux" v-model="item.idx" clearable></el-input>
										<el-button type="primary" icon="el-icon-check" size="mini" @click="trueSort(item)">保存</el-button>
										<el-button type="danger" icon="el-icon-close" size="mini" @click="trueSort(item)">取消</el-button>
									</span>
									<span class="remove el-icon-circle-close" @click="deleteMethod(item.id)"></span>
								</span>
							</div>
						</div>
					</el-collapse-item>
					<el-collapse-item title="面板设置" name="6" class="collapse-title">
						<div class="method-title mt10">
							<el-button type="success" size="mini" @click="addGroup">指派分组</el-button>
							<el-button type="primary" size="mini" @click="addMethod">新增控制</el-button>
							<el-button type="warning" @click="methodeditor = !methodeditor" size="mini">编辑</el-button>
						</div>
					</el-collapse-item>
				</el-collapse>
			</el-row>
			<el-row class="onlineServer" v-else>设备不在线,无法操作！</el-row>
			<!-- 新增类型 -->
			<el-dialog :close-on-click-modal="false" title="请选择要增加的显示类型" :visible.sync="centerDialogVisible" width="30%" center>
				<el-form :model="typeForm" :rules="typerules" ref="typeForm" label-width="150px">
					<el-form-item label="请选择功能类型" prop="value">
						<!--<div class="centercontent">-->
						<el-select clearable v-model="typeForm.value" placeholder="请选择">
							<el-option v-for="item in modularType" :key="item.index" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="centerDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="trueSelect('typeForm')">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 分组 -->
			<el-dialog :close-on-click-modal="false" title="请选择布局" :visible.sync="groupDialogVisible" width="30%" center>
				<el-form :model="groupForm" ref="groupForm" label-width="150px">
					<el-form-item label="请选择控件类型" prop="value">
						<!--<div class="centercontent">-->
						<el-select clearable allow-create filterable v-model="groupForm.value" placeholder="请选择布局(可输入)">
							<el-option v-for="item in groupType" :key="item.index" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="groupDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="trueSelect('groupForm')">确 定</el-button>
				</span>
			</el-dialog>

			<!-- switch -->
			<el-dialog title="增加开关操控" :visible.sync="dialogSwitch" width="70%" align="center">
				<el-table
					class="mdl"
					:row-key="getRowKeys"
					ref="multipleTable"
					:data="tableInstruce"
					tooltip-effect="dark"
					style="width: 100%"
					@selection-change="handleSelectionChange"
				>
					<el-table-column :reserve-selection="true" type="selection" width="55" align="center"> </el-table-column>
					<el-table-column prop="name" label="指令方法" width="120" align="center"> </el-table-column>
					<el-table-column prop="comment" label="指令名称" width="120" align="center"> </el-table-column>
					<el-table-column label="开指令" width="120" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.open" clearable placeholder="请选择" value-key="id">
								<el-option v-for="(item, index) in scope.row.options" :key="index" :label="item.comment" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="关指令" width="120" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.shut" clearable placeholder="请选择" value-key="id">
								<el-option v-for="(item, index) in scope.row.options" :key="index" :label="item.comment" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="开关绑定值" width="220" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.status_mount" placeholder="请选择" size="medium">
								<el-option v-for="item in listShowModule" :key="item.index" :label="item.label" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="按钮名称" width="150" align="center">
						<template slot-scope="scope">
							<el-input v-model="scope.row.otherName">{{ scope.row.otherName }}</el-input>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					class="pagin"
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					:current-page="currentPage1"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize1"
					layout="total, sizes, prev, pager, next, jumper"
					:total="controltotal"
				>
				</el-pagination>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogSwitch = false">取 消</el-button>
					<el-button type="primary" @click="trueAddSwitch">确 定</el-button>
				</span>
			</el-dialog>
			<!-- button -->
			<el-dialog title="增加按钮操控" :visible.sync="dialogButton" width="50%" align="center">
				<el-table
					class="mdl"
					:row-key="getRowKeys"
					ref="multipleTable"
					:data="tableInstruce"
					tooltip-effect="dark"
					style="width: 100%"
					@selection-change="buttonChange"
				>
					<el-table-column :reserve-selection="true" type="selection" width="55" align="center"> </el-table-column>
					<el-table-column prop="name" label="指令方法" width="120" align="center"> </el-table-column>
					<el-table-column prop="comment" label="指令名称" width="120" align="center"> </el-table-column>
					<el-table-column label="按钮状态" width="120" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.buttonzt" clearable placeholder="请选择" value-key="id">
								<el-option v-for="(item, index) in buttonStatic" :key="index" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="按钮绑定值" width="220" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.status_mount" placeholder="请选择" size="medium">
								<el-option v-for="item in listShowModule" :key="item.index" :label="item.label" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					class="pagin"
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					:current-page="currentPage1"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize1"
					layout="total, sizes, prev, pager, next, jumper"
					:total="controltotal"
				>
				</el-pagination>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogButton = false">取 消</el-button>
					<el-button type="primary" @click="trueAddButton">确 定</el-button>
				</span>
			</el-dialog>
			<!-- slider -->
			<el-dialog title="增加滑块操控" :visible.sync="dialogSlider" width="70%" align="center">
				<el-table
					class="mdl"
					:row-key="getRowKeys"
					ref="multipleTable"
					:data="tableInstruce"
					tooltip-effect="dark"
					style="width: 100%"
					@selection-change="sliderChange"
				>
					<el-table-column :reserve-selection="true" type="selection" width="55" align="center"> </el-table-column>
					<el-table-column prop="name" label="指令方法" width="120" align="center"> </el-table-column>
					<el-table-column prop="comment" label="指令名称" width="120" align="center"> </el-table-column>
					<el-table-column label="滑块状态" width="120" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.sliderzt" clearable placeholder="请选择" value-key="id">
								<el-option v-for="(item, index) in buttonStatic" :key="index" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="滑块类型" width="120" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.sliderValue" clearable placeholder="请选择" value-key="id">
								<el-option v-for="(item, index) in scope.row.options" :key="index" :label="item.comment" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="滑块绑定值" width="220" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.status_mount" placeholder="请选择" size="medium">
								<el-option v-for="item in listShowModule" :key="item.index" :label="item.label" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="滑块名称" width="150" align="center">
						<template slot-scope="scope">
							<el-input v-model="scope.row.sliderName"></el-input>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					class="pagin"
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					:current-page="currentPage1"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize1"
					layout="total, sizes, prev, pager, next, jumper"
					:total="controltotal"
				>
				</el-pagination>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogSlider = false">取 消</el-button>
					<el-button type="primary" @click="trueAddSlider">确 定</el-button>
				</span>
			</el-dialog>
			<!-- radio -->
			<el-dialog title="增加按钮操控" :visible.sync="dialogRadio" width="50%" align="center">
				<el-table
					class="mdl"
					:row-key="getRowKeys"
					ref="multipleTable"
					:data="tableInstruce"
					tooltip-effect="dark"
					style="width: 100%"
					@selection-change="changeRadio"
				>
					<el-table-column :reserve-selection="true" type="selection" width="55" align="center"> </el-table-column>
					<el-table-column prop="name" label="指令方法" width="120" align="center"> </el-table-column>
					<el-table-column prop="comment" label="指令名称" width="120" align="center"> </el-table-column>
					<el-table-column label="按钮状态" width="120" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.radiozt" clearable placeholder="请选择" value-key="id">
								<el-option v-for="(item, index) in buttonStatic" :key="index" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="按钮绑定值" width="220" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.status_mount" placeholder="请选择" size="medium">
								<el-option v-for="item in listShowModule" :key="item.index" :label="item.label" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					class="pagin"
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					:current-page="currentPage1"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize1"
					layout="total, sizes, prev, pager, next, jumper"
					:total="controltotal"
				>
				</el-pagination>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogRadio = false">取 消</el-button>
					<el-button type="primary" @click="trueAddRadio">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog title="请选择要显示的值" :visible.sync="viemsDialogVisible" width="30%" center>
				<el-form :model="viemForm" :rules="rules" ref="viemForm" label-width="100px">
					<el-form-item label="绑定状态值" prop="viem">
						<!-- <el-input
              v-model="viemForm.viem"
              placeholder="例如base.system_enabled"
            ></el-input> -->
						<el-select v-model="viemForm.viem" placeholder="请选择" size="medium">
							<el-option v-for="item in listShowModule" :key="item.index" :label="item.label" :value="item"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="名称" prop="name" class="viemmgt">
						<el-input v-model="viemForm.name"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="viemsDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="viemSubForm('viemForm')">确定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="增加空调操控" :visible.sync="dialogAir" width="70%" align="center">
				<el-table
					class="mdl"
					:row-key="getRowKeys"
					ref="multipleTable"
					:data="tableInstruce"
					tooltip-effect="dark"
					style="width: 100%"
					@selection-change="changeAir"
				>
					<el-table-column :reserve-selection="true" type="selection" width="55" align="center"> </el-table-column>
					<el-table-column prop="name" label="指令方法" width="120" align="center"> </el-table-column>
					<el-table-column prop="comment" label="指令名称" width="120" align="center"> </el-table-column>
					<el-table-column label="按钮状态" width="120" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.airzt" clearable placeholder="请选择" value-key="id">
								<el-option v-for="(item, index) in buttonStatic" :key="index" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="温度" width="100" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.temperature" placeholder="请选择">
								<el-option v-for="item in temperature" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="空调模式" width="150" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.airmode" clearable placeholder="请选择">
								<el-option v-for="(item, index) in scope.row.options" :key="index" :label="item.comment" :value="item.id">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="按钮绑定值" width="220" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.status_mount" placeholder="请选择" size="medium">
								<el-option v-for="item in listShowModule" :key="item.index" :label="item.label" :value="item"> </el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					class="pagin"
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					:current-page="currentPage1"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize1"
					layout="total, sizes, prev, pager, next, jumper"
					:total="controltotal"
				>
				</el-pagination>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogAir = false">取 消</el-button>
					<el-button type="primary" @click="trueAddAir">确 定</el-button>
				</span>
			</el-dialog>
		</el-main>
	</el-container>
</template>

<script>
import { number } from 'echarts'
export default {
	// props: {
	//   rows: {
	//     type: Object,
	//     required: true
	//   }
	// },
	props: ['idValue'],
	data() {
		return {
			// props:["id"],

			rows: {},
			options: [
				{
					value: '选项1',
					label: '720P@50fps'
				},
				{
					value: '选项2',
					label: '720P@60fps'
				},
				{
					value: '选项3',
					label: '1080P@50fps',
					disabled: true
				},
				{
					value: '选项4',
					label: '1080P@60fps'
				},
				{
					value: '选项5',
					label: '800x600@60fps'
				},
				{
					value: '选项6',
					label: '1024x768@60fps'
				},
				{
					value: '选项7',
					label: '1280x1024@60fps'
				},
				{
					value: '选项8',
					label: '1366x768@60fps'
				}
			],
			value: '',
			activeName: '',
			classStatus: false,
			viemStatus: {},
			projectorStatus: false,
			bumurise: false,
			bumudrop: false,
			music: 50,
			ext_info: {},
			lockElectronic: false,
			computer: false,
			supply: false,
			lightsFront: false,
			lightsMediate: false,
			lightsRear: false,
			curtains: false,
			fan: false,
			air: false,
			airtemperature: 24,
			temperature: [
				{
					value: 18,
					label: '18度'
				},
				{
					value: 20,
					label: '20度'
				},
				{
					value: 22,
					label: '22度'
				},
				{
					value: 25,
					label: '25度'
				},
				{
					value: 28,
					label: '28度'
				}
			],
			// activatTabName: "",
			frontdeng: '',
			middledeng: '',
			backdeng: '',
			cur: 0,
			disabled: true,
			checkedbm: false,
			bm: {
				disabled: true
			},
			zhus: ['电脑', 'HDMI1', 'HDMI2', '广播'],
			fus: ['电脑', 'HDMI1', 'HDMI2'],
			radiozhu: 0,
			radiofu: 0,
			Microphone: 50,
			sn: '',
			ip: '',
			id: '',
			place: '',
			status: null,
			zdy: 'power',
			tyj: 'projector',
			bmrise: 'power_screen_up',
			bmdrop: 'power_screen_down',
			diannao: 'computer',
			qiandeng: 'light',
			zhongdeng: 'light',
			houdeng: 'light',
			voltage: 220,
			power: 20,
			powerfactor: 0.86,
			electric_current: 0.1,
			electricity_consumption: 310,
			classrooms: [],
			allLists: [],
			listSwitch: [],
			listSwitchs: [],
			listButton: [],
			listView: [],
			listSlider: [],
			listRadio: [],
			// 显示模块状态值
			listShowModule: [],
			listAir: [
				{
					name: '空调',
					options: {
						method: 'airconditioner',
						type: 'air',
						status_mount: 0,
						key: 'electronic.billing.device_accumulate',
						temperature: 22,
						airmode: 0,
						configs: [
							{ attr: '00', comment: '制冷' },
							{ attr: '11', comment: '制热' },
							{ attr: '22', comment: '清风' },
							{ attr: '33', comment: '辅热' },
							{ attr: '44', comment: '自动' }
						]
					}
				}
			],
			groupDialogVisible: false,
			modularType: [
				{ value: 'switch', label: '开关' },
				{ value: 'button', label: '按钮' },
				{ value: 'slider', label: '滑块' },
				{ value: 'radio', label: '单选框' },
				{ value: 'view', label: '显示模块' }
				// { value: "air", label: "空调" },
			],
			groupType: [],
			buttonStatic: [
				{ value: true, label: '开' },
				{ value: false, label: '关' }
			],
			currentPage1: 1,
			pageSize1: localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10,
			controltotal: 1,
			alltrue: [],
			viemForm: {
				viem: '',
				name: ''
			},
			rules: {
				viem: [
					{
						required: true,
						message: '请输入查询状态',
						trigger: 'blur'
					}
				],
				name: [
					{
						required: true,
						message: '请输入显示名称',
						trigger: 'blur'
					}
				]
			},
			typeForm: {
				value: ''
			},
			groupForm: {
				value: ''
			},
			typerules: {
				value: [{ required: true, message: '请选择类型', trigger: 'change' }]
			},
			// grouprules: {
			//   value: [
			//     { required: true, message: "请选择控件类型", trigger: "change" },
			//   ],
			// },
			centerDialogVisible: false,
			viemsDialogVisible: false,
			methodeditor: false,
			tableInstruce: [],
			trueSwitch: [],
			trueButton: [],
			trueSlider: [],
			trueRadio: [],
			trueAir: [],
			dialogSwitch: false,
			dialogButton: false,
			dialogSlider: false,
			dialogRadio: false,
			dialogAir: false,
			groupName: '',
			getRowKeys(row) {
				return row.id
			},
			autofocus: true,
			isline: false,
			isDisplay: false
		}
	},
	created: function () {
		this.getMethodState()
		// 11-23
		this.timerOut()
	},
	// mounted:function(){
	//   console.log("this.idValue",this.idValue)
	//   this.getShowModule(this.idValue)

	// },
	destroyed: function () {
		window.clearInterval(this.timer)
	},
	methods: {
		isSwitch(a) {
			console.log('a        ' + typeof a)
			if (typeof a == 'boolean') return a
			if (typeof a == 'number') {
				console.log(a, a > 0)
				return a > 0
			}
			return false
		},
		listNumber(arrName) {
			if (arrName.length > 0) return 'x' + arrName.length
			return ' '
		},
		handleClick(e) {
			// 11-23
			this.timerOut()
			// this.activatTabName = e.name;
		},
		setGroupName(name) {
			this.groupName = name
			//2022-2-24 fixed
			// this.getMethodState()
		},
		// 获取显示模块数组
		getShowModule(id) {
			console.log('id--------->', id)
			this.api.terminal.getShowModule(id).then(res => {
				console.log('获取显示模块数组', res)
				if (res.data.status) {
					let status = res.data.status
					this.listShowModule = this.getObjectKeyLIst(status)
					// console.log("this.listShowModule", this.listShowModule);
				}
			})
		},

		getObjectKeyLIst(o, base) {
			if (o instanceof Object) {
				let list = []
				for (var key in o) {
					list = list.concat(this.getObjectKeyLIst(o[key], base ? base + '.' + key : key))
				}
				return list
			} else if (base) {
				return [base]
			}
		},

		//获取设备按钮界面排布
		async getMethodState() {
			let res = await this.api.terminal.getMethodState()
			this.allLists = res.data.data
			// .then(res => {
			// 	// console.log('按钮布局', res)

			// })
			// .catch(err => console.log(err))
		},
		//更新数据
		updateStatus() {
			this.listSwitch = []
			this.listButton = []
			this.listView = []
			this.listSlider = []
			this.listRadio = []
			// if (this.groupName != "") {
			this.allLists = this.allLists.filter(ele => {
				if (ele.options.groupName) {
					this.groupType.push({
						value: ele.options.groupName,
						label: ele.options.groupName
					})
				}
				if (!ele.options | !ele.options.groupName) {
					ele.options.groupName = ''
				}
				return ele.options.groupName == this.groupName
			})

			this.groupType = Array.from(new Set(this.groupType))
			let obj = {}
			this.groupType = this.groupType.reduce((cur, next) => {
				obj[next.value] ? '' : (obj[next.value] = true && cur.push(next))
				return cur
			}, [])
			if (this.allLists) {
				console.log(`build up ----- updateStatus ----- this.allLists`, this.allLists)
				for (let item of this.allLists) {
					if (item.options.type == 'switch') {
						this.listSwitch.push(item)
					} else if (item.options.type == 'button') {
						this.listButton.push(item)
					} else if (item.options.type == 'view') {
						this.listView.push(item)
					} else if (item.options.type == 'slider') {
						this.listSlider.push(item)
					} else if (item.options.type == 'radio') {
						this.listRadio.push(item)
					}
				}
				//去重
				this.duplicateRemoval(this.listSwitch)
				this.duplicateRemoval(this.listButton)
				this.duplicateRemoval(this.listSlider)
				this.duplicateRemoval(this.listRadio)
				//排序
				this.listSwitchs = this.listSwitch
				this.allSort(this.listSwitch)
				this.allSort(this.listButton)
				this.allSort(this.listView)
				this.allSort(this.listSlider)
				this.allSort(this.listRadio)
			}
		},
		// done 轮询 11-23

		timerOut() {
			window.clearInterval(this.timer) //清除原有的轮询
			this.timer = setInterval(() => {
				if (this.idValue) {
					this.api.terminal
						.getState(this.idValue)
						.then(res => {
							if (res.data.status != null) {
								this.isline = true
								const id = this.idValue
								let status = JSON.parse(localStorage.getItem('viemStatus')) || {}
								for (let i in status[id]) {
									if (res.data.status[i].timestamp > status[id][i].timestamp) {
										this.isDisplay = false
										this.viemStatus[i] = res.data.status[i]
										status[id] = this.viemStatus
										localStorage.setItem('viemStatus', JSON.stringify(status))
									} else {
										res.data.status[i] = status[id][i]
									}
								}
								this.viemStatus = res.data.status
								this.putAllStates(this.viemStatus) //设备初始状态
								// setTimeout(() => {
								this.updateStatus()
								// }, 0)
							} else {
								this.isline = false
								window.clearInterval(this.timer)
							}
						})
						.catch(err => {
							console.log(err)
						})
				}
			}, 1000)
		},
		//去重
		duplicateRemoval(arr) {
			for (let shu of arr) {
				if (shu.options.configs) {
					let obj = {}
					shu.options.configs = shu.options.configs.reduce(function (item, next) {
						obj[next.attr] ? '' : (obj[next.attr] = true && item.push(next))
						return item
					}, [])
				}
			}
			return arr
		},
		//排序
		allSort(arr) {
			arr.sort(function (a, b) {
				return b.idx - a.idx
			})
		},
		//获取设备状态
		getState(row, timeout) {
			if (row) {
				this.rows = row
				if (row.online) {
					this.isline = true
					this.getDevState(row.id, timeout)
				} else {
					this.isline = false
				}
			} else {
				this.rows = {}
				this.isline = false
			}
		},
		async getDevState(id, timeout) {
			let res = await this.api.terminal.getState(id, timeout)
			this.timerOut()
			if (res.data.result.code === 0) {
				let status = JSON.parse(localStorage.getItem('viemStatus')) || {}
				this.viemStatus = res.data.status
				status[id] = this.viemStatus
				localStorage.setItem('viemStatus', JSON.stringify(status))
				this.isDisplay = false
				this.putAllStates(this.viemStatus) //设备初始状态
			} else {
				console.log('error----------', res)
			}
		},
		//所有开关功能
		changeMainpower(item, e) {
			this.isDisplay = true
			setTimeout(() => {
				this.isDisplay = false
			}, 5000)
			if (this.rows.id) {
				window.clearInterval(this.timer)
				let callback = e
				let method = item.options.method
				let status = JSON.parse(localStorage.getItem('viemStatus')) || {}
				if (item.options.configs) {
					for (let sth of item.options.configs) {
						if (callback == sth.value) {
							if (item.options.key) {
								let arr = item.options.key.split('.')
								switch (arr.length) {
									case 2:
										status[this.rows.id][arr[0]][arr[1]] = sth.attr
										break
									case 3:
										status[this.rows.id][arr[0]][arr[1]][arr[2]] = sth.attr
										break
									default:
										break
								}
							}
							localStorage.setItem('viemStatus', JSON.stringify(status))
							if (this.rows.controlId) {
								let param = { id: this.rows.controlId }
								this.api.terminal
									.changeMainpower(0, method, sth.attr, param)
									.then(() => {
										this.getDevState(this.idValue, 5)
									})
									.catch(err => {
										console.log(err)
									})
							} else {
								this.api.terminal
									.changeMainpower(this.rows.id, method, sth.attr)
									.then(() => {
										this.getDevState(this.idValue, 5)
									})
									.catch(err => {
										console.log(err)
									})
							}
						}
					}
				}
			} else if (this.rows.onlines == false) {
				this.$message.error('该设备未在线！')
				return false
			} else {
				this.$message.error('请选择设备！')
				return false
			}
		},
		//所有按钮功能
		changeButton(item, btn) {
			if (this.rows.id) {
				if (this.rows.controlId) {
					let method = item.options.method
					let param = { id: this.rows.controlId }
					this.api.terminal
						.changeMainpower(0, method, btn.attr, param)
						.then(() => {
							this.getDevState(this.idValue, 5)
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					let method = item.options.method
					this.api.terminal
						.changeMainpower(this.rows.id, method, btn.attr)
						.then(() => {
							this.getDevState(this.idValue, 5)
						})
						.catch(err => {
							console.log(err)
						})
				}
			} else if (this.rows.onlines == false) {
				this.$message.error('该设备未在线！')
				return false
			} else {
				this.$message.error('请选择设备！')
				return false
			}
		},
		//所有单选功能
		radioChange(item) {
			if (this.rows.id) {
				if (this.rows.controlId) {
					let method = item.options.method
					let param = { id: this.rows.controlId }
					this.api.terminal
						.changeMainpower(0, method, item.options.mun, param)
						.then(() => {
							this.getDevState(this.idValue, 5)
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					let method = item.options.method
					this.api.terminal
						.changeMainpower(this.rows.id, method, item.options.mun)
						.then(() => {
							this.getDevState(this.idValue, 5)
						})
						.catch(err => {
							console.log(err)
						})
				}
			} else if (this.rows.onlines == false) {
				this.$message.error('该设备未在线！')
				return false
			} else {
				this.$message.error('请选择设备！')
				return false
			}
		},
		putAllStates(obj) {
			if (obj) {
				for (let item of this.allLists) {
					let status = obj
					if (item.options.key) {
						let keys = item.options.key.split('.')
						for (let key of keys) {
							//捕获异常并抛弃
							try {
								status = status[key]
							} catch (e) {
								console.log(e)
							}
						}

						if (item.options.type == 'switch') {
							if (status === null) item.options.isDisplay = true
							item.options.status_mount = status
							item.options.status_mount_is = Boolean(status)
						} else if (item.options.type == 'view') {
							item.options.contents = status
							console.log(`build up ----- putAllStates ----- item.options.contents`, item.options.contents)
						} else if (item.options.type == 'button') {
							item.options.contents = status
						} else if (item.options.type == 'slider') {
							item.options.music = status
						} else if (item.options.type == 'radio') {
							item.options.mun = status
						}
					} else {
						status = null
					}
				}
			}
		},
		//音量显示
		formatTooltip() {
			return `音量`
		},
		//音量调节
		changeVolume(item, silence = '') {
			if (this.rows.id) {
				let param = {}
				if (silence == 1) {
					//静音
					item.options.music = 0
				}
				if (this.rows.controlId) {
					param = {
						id: this.rows.controlId,
						measure: parseInt(item.options.music)
					}
					this.api.terminal
						.changeMainpower(0, item.options.method, item.options.attr, param)
						.then(() => {
							this.getDevState(this.idValue, 5)
						})
						.catch(err => {
							console.log(err)
						})
				} else {
					param = { measure: parseInt(item.options.music) }
					this.api.terminal
						.changeMainpower(this.rows.id, item.options.method, item.options.attr, param)
						.then(() => {
							this.getDevState(this.idValue, 5)
						})
						.catch(err => {
							console.log(err)
						})
				}
				// this.modeMethod(item)
			} else if (this.rows.onlines == false) {
				this.$message.error('该设备未在线！')
				return false
			} else {
				this.$message.error('请选择设备！')
				return false
			}
		},
		//删除方法
		deleteMethod(id) {
			if (this.rows.id) {
				this.$confirm('此操作将永久删除该功能, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						this.api.terminal
							.deleteMethod(id)
							.then(() => {
								this.getMethodState()
								this.$message({
									message: '删除成功！',
									type: 'success'
								})
							})
							.catch(err => {
								console.log(err)
							})
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						})
					})
			} else if (this.rows.onlines == false) {
				this.$message.error('该设备未在线！')
				return false
			} else {
				this.$message.error('请选择设备！')
				return false
			}
		},
		addGroup() {
			this.groupDialogVisible = true
		},
		//点击新增
		addMethod() {
			if (this.rows.id) {
				this.centerDialogVisible = true
			} else if (this.rows.onlines == false) {
				this.$message.error('该设备未在线！')
				return false
			} else {
				this.$message.error('请选择设备！')
				return false
			}
		},

		// done 控制新增类型
		//选择显示模块类型

		trueSelect(formName) {
			console.log('formName==>', formName)
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (formName === 'groupForm') {
						;(this.ext_info.tag = 'groupName'), (this.ext_info.value = this.groupForm.value)
						this.api.terminal.changeState(this.idValue, 'ext_info', JSON.stringify(this.ext_info)).then(res => {
							if (res.data.result) {
								this.groupDialogVisible = false
								let isRulus = this.groupType.find(ele => {
									return ele.value == this.groupForm.value
								})
								if (!isRulus)
									this.groupType.push({
										value: this.groupForm.value,
										label: this.groupForm.value
									})
								this.groupName = this.groupForm.value
								this.$message({
									message: '修改成功',
									type: 'success'
								})
								this.getMethodState()
								this.$emit('getMethodStates')
								this.groupForm.value = ''
							}
						})
						return
					}
					this.getShowModule(this.idValue)
					if (this.typeForm.value == 'view') {
						this.viemsDialogVisible = true
						this.centerDialogVisible = false
					} else if (this.typeForm.value == 'switch') {
						this.getControl()
						this.dialogSwitch = true
						this.centerDialogVisible = false
					} else if (this.typeForm.value == 'button') {
						this.getControl()
						this.dialogButton = true
						this.centerDialogVisible = false
					} else if (this.typeForm.value == 'slider') {
						this.getControl()
						this.dialogSlider = true
						this.centerDialogVisible = false
					} else if (this.typeForm.value == 'radio') {
						this.getControl()
						this.dialogRadio = true
						this.centerDialogVisible = false
					} else if (this.typeForm.value == 'air') {
						this.getControl()
						this.dialogAir = true
						this.centerDialogVisible = false
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 新增
		// addMethods(value) {
		//   this.getShowModule(this.idValue);
		//   if (value == "view") {
		//     this.viemsDialogVisible = true;
		//   } else if (value == "switch") {
		//     this.getControl();
		//     this.dialogSwitch = true;
		//   } else if (value == "button") {
		//     this.getControl();
		//     this.dialogButton = true;
		//   } else if (value == "slider") {
		//     this.getControl();
		//     this.dialogSlider = true;
		//   } else if (value == "radio") {
		//     this.getControl();
		//     this.dialogRadio = true;
		//   } else if (value == "air") {
		//     this.getControl();
		//     this.dialogAir = true;
		//   }
		// },
		//确认提交显示模块
		viemSubForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let statusmount = this.deviceStatus(this.viemForm.viem)
					let param = {
						name: this.viemForm.name,
						idx: 0,
						options: {
							content: statusmount,
							type: 'view',
							key: this.viemForm.viem,
							disabledIdx: false
						}
					}
					this.postAddMethod(param)

					this.viemsDialogVisible = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
			this.viemForm = []
			this.$refs.multipleTable.clearSelection()
		},
		//确认增加开关控制
		trueAddSwitch() {
			if (this.trueSwitch) {
				for (let item of this.trueSwitch) {
					if (item.otherName) {
						let configs = []
						let statusmount = ''
						if (item.status_mount) {
							statusmount = this.deviceStatus(item.status_mount)
						} else {
							statusmount = null
						}
						configs.push({ value: true, attr: item.open.attr }, { value: false, attr: item.shut.attr })
						let param = {
							name: item.otherName,
							idx: 0,
							options: {
								method: item.name,
								type: 'switch',
								status_mount: statusmount,
								key: item.status_mount,
								configs: configs,
								disabledIdx: false
							}
						}
						this.postAddMethod(param)
						this.dialogSwitch = false
					} else {
						this.$message('已勾选的指令名称没有填写完！')
						return
					}
				}
			}
			this.trueSwitch = []
			this.$refs.multipleTable.clearSelection()
		},
		//确认增加按钮
		trueAddButton() {
			if (this.trueButton) {
				for (let item of this.trueButton) {
					let configs = []
					for (let btn of item.options) {
						configs.push({ attr: btn.attr, comment: btn.comment })
					}
					let param = {
						name: item.comment,
						idx: 0,
						options: {
							method: item.name,
							type: 'button',
							status_mount: item.buttonzt,
							key: item.status_mount,
							configs: configs,
							disabledIdx: false
						}
					}
					this.postAddMethod(param)
					this.dialogButton = false
				}
			}
			this.trueButton = []
			this.$refs.multipleTable.clearSelection()
		},
		//确认增加滑块
		trueAddSlider() {
			if (this.trueSlider) {
				for (let item of this.trueSlider) {
					//					console.log(item)
					if (item.sliderName) {
						let statusmount = ''
						if (item.status_mount) {
							statusmount = this.deviceStatus(item.status_mount)
						} else {
							statusmount = 0
						}
						//						if(!item.options) {
						//							this.$message("该指令没有创建子指令，请到指令模块创建")
						//							return
						//						}
						let param = {
							name: item.sliderName,
							idx: 0,
							options: {
								method: item.name,
								type: 'slider',
								status_mount: item.sliderzt,
								key: item.status_mount,
								music: parseInt(statusmount),
								attr: item.sliderValue.attr,
								disabledIdx: false
							}
						}
						this.postAddMethod(param)
						this.dialogSlider = false
					} else {
						this.$message('已勾选的指令名称没有填写！')
						return
					}
				}
			}
			this.trueSlider = []
			this.$refs.multipleTable.clearSelection()
		},
		//确认单选按钮
		trueAddRadio() {
			if (this.trueRadio) {
				for (let item of this.trueRadio) {
					let configs = []
					let statusmount = ''
					if (item.status_mount) {
						statusmount = this.deviceStatus(item.status_mount)
					} else {
						statusmount = 0
					}
					for (let rdo of item.options) {
						configs.push({ attr: rdo.attr, comment: rdo.comment })
					}
					let param = {
						name: item.comment,
						idx: 0,
						options: {
							method: item.name,
							type: 'radio',
							mun: statusmount,

							status_mount: item.radiozt,
							key: item.status_mount,
							configs: configs,
							disabledIdx: false
						}
					}
					//						console.log(param)
					//						return
					this.postAddMethod(param)
					this.dialogRadio = false
				}
			}
			this.trueRadio = []
			this.$refs.multipleTable.clearSelection()
		},
		//确认空调按钮
		trueAddAir() {
			if (this.trueAir) {
				for (let item of this.trueAir) {
					let configs = []
					// let statusmount = this.deviceStatus(item.status_mount);
					for (let air of item.options) {
						configs.push({ attr: air.attr, comment: air.comment })
					}
					let param = {
						name: item.comment,
						idx: 0,
						options: {
							method: item.name,
							type: 'air',
							airmode: item.airmode,
							status_mount: item.airzt,
							temperature: item.temperature,
							key: item.status_mount,
							configs: configs,
							disabledIdx: false
						}
					}
					//					console.log(param)
					//					return
					this.postAddMethod(param)
					this.dialogRadio = false
				}
			}
			this.trueAir = []
			this.$refs.multipleTable.clearSelection()
		},
		//状态值函数
		deviceStatus(data) {
			let contentValue = ''
			let keys = data.split('.')
			let status = this.viemStatus
			//				console.log(keys)
			if (keys) {
				for (var key of keys) {
					// 捕获异常并抛弃
					try {
						status = status[key]
					} catch (e) {
						console.log(e)
					}
				}
				contentValue = status
				return contentValue
			} else {
				contentValue = null
				return contentValue
			}
		},
		//新增操作指令方法的函数
		postAddMethod(param) {
			if (this.groupName) {
				param.options.groupName = this.groupName
			} else {
				param.options.groupName = ''
			}
			this.api.terminal
				.postMethod(0, param)
				.then(() => {
					this.getMethodState()
					this.$message({
						type: 'success',
						message: '添加成功！'
					})
				})
				.catch(err => {
					console.log(err)
				})
		},
		//修改类目控制
		modeMethod(item) {
			// console.log(item)
			let id = item.id
			let param = {
				name: item.name,
				idx: item.idx,
				options: item.options
			}
			if (item.options.type == 'radio' && item.options.status_mount == true) {
				this.radioChange(item)
			}
			this.api.terminal
				.postMethod(id, param)
				.then(() => {
					this.getDevState(this.idValue, 5)
					this.getMethodState()
				})
				.catch(err => {
					console.log(err)
				})
		},
		// done 获取任务操作列表
		getControl() {
			this.api.addcontrol
				.getInstructions(this.currentPage1 - 1, this.pageSize1)
				.then(res => {
					this.tableInstruce = res.data.cmd_info_list.cmd_property_list
					this.controltotal = res.data.cmd_info_list.total
				})
				.catch(err => {
					console.log(err)
				})
		},
		//条数
		handleSizeChange1(val) {
			this.pageSize1 = val
			localStorage.setItem('pageSize', val) //更新本地缓存pageSize的默认条数
			this.getControl()
			//      console.log(`每页 ${val} 条`);
		},
		//页数
		handleCurrentChange1(val) {
			this.currentPage1 = val
			this.getControl()
			//      console.log(`当前页: ${val}`);
		},
		//选择开关类目
		handleSelectionChange(val) {
			console.log('val', val)
			//				console.log(val)
			this.trueSwitch = val
		},
		//选择按钮类目
		buttonChange(val) {
			//				console.log(val)
			this.trueButton = val
		},
		//选择滑块类目
		sliderChange(val) {
			//				console.log(val)
			this.trueSlider = val
		},
		//选择单选按钮类目
		changeRadio(val) {
			this.trueRadio = val
		},
		//选择空调
		changeAir(val) {
			this.trueAir = val
		},
		//改变温度
		changeTemperature(val) {
			console.log(val)
		},
		//调节空调模式
		airMode() {},
		//排序
		changeSort(item) {
			item.options.disabledIdx = true
			let param = {
				name: item.name,
				idx: parseInt(item.idx),
				options: item.options
			}
			this.api.terminal
				.postMethod(item.id, param)
				.then(() => {
					this.getMethodState()
				})
				.catch(err => {
					console.log(err)
				})
		},
		//确认修改排序
		trueSort(item) {
			item.options.disabledIdx = false
			let param = {
				name: item.name,
				idx: parseInt(item.idx),
				options: item.options
			}
			this.api.terminal
				.postMethod(item.id, param)
				.then(() => {
					this.getMethodState()
				})
				.catch(err => {
					console.log(err)
				})
		}
	},
	//2022-2-24
	filters: {
		viewFixed(listview) {
			if (listview) {
				return listview
			} else {
				return '值为空'
			}
		}
	}
}
</script>

<style scoped>
.method-title {
	margin: 10px;
}
.centercontent {
	text-align: center;
}
.d {
	margin-top: 7px;
	margin-left: 10px;
}

.na {
	display: block;
	line-height: normal;
	font-size: 13px;
	color: #a8a8a8;
}

.na_con {
	margin-left: 5px;
	color: #000000;
}

.main-switch {
	overflow: hidden;
	margin: 20px 0;
}

.box {
	margin-top: -20px;
}

.c-a {
	margin-right: 2px;
	font-size: 12px;
	line-height: 43px;
}

.switch {
	float: right;
	margin-right: 10px;
}

.voice {
	margin-right: 10px;
	padding-top: 10px;
	overflow: hidden;
	border-bottom: 1px solid #e7e5e5;
}

.music {
	margin-bottom: 5px;
}

.light-box {
	border-bottom: 1px solid #e7e5e5;
	margin-left: 10px;
}
.music.light-box {
	margin-left: 0;
}
.col-light {
	border-bottom: 0;
	overflow: hidden;
}

.col-title {
	line-height: 40px;
	color: #4d4d4d;
	font-size: 14px;
	overflow: hidden;
	display: block;
	float: left;
	height: 40px;
}
.demonstration {
	margin-right: 10px;
}
.class-environment {
	width: 100%;
	padding: 15px 0;
	display: block;
}
.project-box {
	width: 40%;
	display: inline-block;
	flex-direction: row;
	justify-content: space-around;
	margin-bottom: 30px;
	margin-left: 9%;
}
.project {
	padding: 5px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	width: 30%;
	min-width: 110px;
	overflow: hidden;
	background: cadetblue;
	display: block;
	text-align: center;
	color: #ffffff;
}
.project-first {
	color: #eee;
	font-size: 12px;
}
.project-last {
	font-size: 16px;
}
.mdt {
	margin: 10px 0;
}
.mt10 {
	margin-top: 10px;
}
.remove {
	line-height: 35px;
	color: red;
	margin-left: 20px;
}
.btn_name {
	margin: 0px 0 20px 10px;
}
.btn_option {
	margin: 5px 5px 20px 20px;
	display: inline-block;
}
.viemmgt {
	margin-top: 20px;
}
.onlineServer {
	font-size: 20px;
	line-height: 20px;
	margin: 50px 0 50px 20px;
	color: #000000;
}
.pai {
	margin-left: 10px;
}
.shux {
	width: 100px;
}
.el-collapse >>> .el-collapse-item__content {
	padding-bottom: 0px;
}
.el-collapse {
	border-radius: 10px;
}
.title.mt10.el-row {
	margin-bottom: 12px;
}
.el-collapse .el-collapse-item {
	border: 3px #eeeeee solid;
	margin-bottom: 10px;
	border-radius: 10px;
}
.el-collapse-item >>> .el-collapse-item__header {
	background: #eeeeee;
	color: #0188cc;
	padding-left: 1em;
	height: 32px;
	font-size: 12px;
}
.grid-content.bg-purple-dark {
	padding-top: 10px;
}
</style>
