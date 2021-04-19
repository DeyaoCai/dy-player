# Three

### 场景， 摄像头（视野）， 渲染器
## <a id="TScene">场景(Scene)</a>
场景大概就是一个空间坐标系，用于存放需要渲染的内容，灯光，摄像机等；

创建场景
```javascript
const scene = new THREE.Scene();
```

## <a id="TScene">摄像机(Camera)</a>
可以理解为视野或者观察者， 可以指定位置， 观察方向， 视野大小等；

### 相机分类
|相机名称|类|描述|
|---|---|---|
|摄像机|Camera|相机基类|
|立方相机|CubeCamera|---|
|正交相机|OrthographicCamera|---|
|透视相机|PerspectiveCamera|用它就对了|
|立体相机|StereoCamera|---|

### <a id="Scene">摄像机(Camera)</a>
摄像机的抽象基类。在构建新摄像机时，应始终继承此类。

## <a id="TRenderer">渲染器(Renderer)</a> 
渲染器将摄像机里面看到的内容渲染在页面上。

### 渲染器分类
|渲染器名称|类|描述|
|---|---|---|
|WebGLMultisampleRenderTarget|WebGLMultisampleRenderTarget|---|
|WebGLRenderer|WebGLRenderer|用它就对了|
|WebGL1Renderer|WebGL1Renderer|---|
|WebGLRenderTarget|WebGLRenderTarget|---|
|WebGLCubeRenderTarget|WebGLCubeRenderTarget|---|


## 模型
模型是场景的物体， 一般包含几何体，材质/贴图等。


### 几何体列表
|模型名称|类|描述|
|---|---|---|
|立方缓冲几何体|BoxBufferGeometry|---|
|圆形缓冲几何体|CircleBufferGeometry|---|
|圆锥缓冲几何体|ConeBufferGeometry|---|
|圆柱缓冲几何体|CylinderBufferGeometry|---|
|十二面缓冲几何体|DodecahedronBufferGeometry|---|
|边缘几何体|EdgesGeometry|---|
|挤压缓冲几何体|ExtrudeBufferGeometry|---|
|二十面缓冲几何体|IcosahedronBufferGeometry|---|
|车削缓冲几何体|LatheBufferGeometry|---|
|八面缓冲几何体|OctahedronBufferGeometry|---|
|参数化缓冲几何体|ParametricBufferGeometry|---|
|平面缓冲几何体|PlaneBufferGeometry|---|
|多面缓冲几何体|PolyhedronBufferGeometry|---|
|圆环缓冲几何体|RingBufferGeometry|---|
|形状缓冲几何体|ShapeBufferGeometry|---|
|球缓冲几何体|SphereBufferGeometry|---|
|四面缓冲几何体|TetrahedronBufferGeometry|---|
|文本缓冲几何体|TextBufferGeometry|---|
|圆环缓冲几何体|TorusBufferGeometry|---|
|圆环缓冲扭结几何体|TorusKnotBufferGeometry|---|
|管道缓冲几何体|TubeBufferGeometry|---|
|网格几何体|WireframeGeometry|---|


### 材质列表
|模型名称|类|描述|
|---|---|---|
|基础线条材质|LineBasicMaterial|---|
|虚线材质|LineDashedMaterial|---|
|基础网格材质|MeshBasicMaterial|---|
|深度网格材质|MeshDepthMaterial|---|
|MeshDistanceMaterial|MeshDistanceMaterial|---|
|Lambert网格材质|MeshLambertMaterial|---|
|MeshMatcapMaterial|MeshMatcapMaterial|---|
|法线网格材质|MeshNormalMaterial|---|
|Phong网格材质|MeshPhongMaterial|---|
|物理网格材质|MeshPhysicalMaterial|---|
|标准网格材质|MeshStandardMaterial|---|
|MeshToonMaterial|MeshToonMaterial|---|
|点材质|PointsMaterial|---|
|原始着色器材质|RawShaderMaterial|---|
|着色器材质|ShaderMaterial|---|
|阴影材质|ShadowMaterial|---|
|点精灵材质|SpriteMaterial|---|


### 贴图



## 灯光


