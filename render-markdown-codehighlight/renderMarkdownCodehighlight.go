/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 package render_markdown_codehighlight

 import (
	 "embed"
	 "encoding/json"
     "log"
	 "github.com/gin-gonic/gin"
 
	 "github.com/apache/incubator-answer-plugins/render-markdown-codehighlight/i18n"
	 "github.com/apache/incubator-answer-plugins/util"
	 "github.com/apache/incubator-answer/plugin"
	 //"github.com/segmentfault/pacman/log"
 )
 
 //go:embed info.yaml
 var Info embed.FS
 
 type Render struct {
	 Config *RenderConfig
 }
 
 type RenderConfig struct {
	 SelectTheme string `json:"select_theme"`
 }
 
 func init() {
	 plugin.Register(&Render{
		 Config: &RenderConfig{},
	 })
 }
 
 func (r *Render) Info() plugin.Info {
	 info := &util.Info{}
	 info.GetInfo(Info)
 
	 return plugin.Info{
		 Name:        plugin.MakeTranslator(i18n.InfoName),
		 SlugName:    info.SlugName,
		 Description: plugin.MakeTranslator(i18n.InfoDescription),
		 Author:      info.Author,
		 Version:     info.Version,
		 Link:        info.Link,
	 }
 }
 
 func (r *Render) ConfigFields() []plugin.ConfigField {
	 return []plugin.ConfigField{
		 {
			 Name:      "select_theme",
			 Type:      plugin.ConfigTypeSelect,
			 Title:     plugin.MakeTranslator(i18n.ConfigCssFilteringTitle),
			 Required:  false,
			 UIOptions: plugin.ConfigFieldUIOptions{},
			 Value:     r.Config.SelectTheme,
			 Options: []plugin.ConfigFieldOption{
				 {Value: "default", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringDefault)},
				 {Value: "a11y", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringA11y)},
				 {Value: "github", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringGithub)},
				 {Value: "atom", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringAtom)},
				 {Value: "isbl", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringIsbl)},
				 {Value: "kimbie", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringKimbie)},
				 {Value: "nnfx", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringNnfx)},
				 {Value: "panda", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringPanda)},
				 {Value: "paraiso", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringParaiso)},
				 {Value: "qtcreator", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringQtcreator)},
				 {Value: "stackoverflow", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringStackoverflow)},
				 {Value: "tokiyo", Label: plugin.MakeTranslator(i18n.ConfigCssFilteringTokiyo)},
			 },
		 },
	 }
 }
 
 func (r *Render) ConfigReceiver(config []byte) error {
	 c := &RenderConfig{}
	 _ = json.Unmarshal(config, c)
	 r.Config = c
	 log.Println("Received theme:", r.Config.SelectTheme)  // 打印接收到的配置
	 return nil
 }
 
 func (r *Render) GetRenderConfig(ctx *gin.Context) (renderConfig *plugin.RenderConfig) {
	     log.Println("Current theme:", r.Config.SelectTheme)  // 打印当前配置
	     renderConfig = &plugin.RenderConfig{
		 SelectTheme: r.Config.SelectTheme,
	 }
	 return
 }
 