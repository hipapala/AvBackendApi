import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';
import {isEmail, isRequired, summary, errorClass} from '../components/AvValidators';
import {httpHelper} from '../components/AvLoader';  
import {jsPlumb, jsPlumbUtil} from 'jsPlumb';
import '../../css/xml.css';
import { Link, NavLink } from 'react-router-dom';
import { AvContent } from '../components/AvContent';


export default class AvXml extends React.Component {
	state = { isTouched: false, name: '', xmlName: '' };
    myTree = { name: 'Root', childs: [] };
    indexedNodes  = {};    

    initNode = (el, obj) => {
            if (obj.parent) {
                if (obj.parent.childs.indexOf(obj) > 0) {
                    var slib = obj.parent.childs[obj.parent.childs.indexOf(obj) - 1];
                    slib.cn = this.instance.connect({ source: slib.id, target: obj.id, connector: "Straight", anchors: ["Right", "Left"] /*, paintStyle: { strokeStyle: "black", lineWidth: 3 }*/ });
                } else {
                    obj.parent.cn = this.instance.connect({ source: obj.parent.id, target: obj.id, connector: "Flowchart", anchors: ["Bottom", "Left"] });
                }
            }
        };

    newNode = (obj) => {
            var d = document.createElement("div");
            var id = jsPlumbUtil.uuid();
            d.className = "w";
            d.id = id;
            d.innerHTML = obj.name;
            d.style.left = "0px";
            d.style.top = "0px";
            this.instance.getContainer().appendChild(d);

            this.indexedNodes[id] = { obj: obj, el: d };
            obj.id = id;
            this.initNode(d, obj);

            for(var i=0; i < obj.childs.length; i++)
            {
                this.newNode(obj.childs[i]);
            };
                    
            return d;
        };

    setLocation  = (obj, x, y, childY) => {
        var el = this.indexedNodes[obj.id].el;
        var size = childY + 1;
        for (var i = 0; i < obj.childs.length; i++) {
            var child = obj.childs[obj.childs.length - i - 1];
            size = this.setLocation(child, x + obj.childs.length - i, childY, size);
        }

        this.instance.animate(el, { left: x * 140, top: y * 50 }, { duration: 350, easing: 'easeOutBack' });
        setTimeout(() => {
            this.instance.animate(el, { left: x * 140, top: y * 50 }, { duration: 350, easing: 'easeOutBack' });
        }, 500);

        return obj.childs.length > 0 ? size : childY;
    }

	componentDidMount(){
        var _this = this;
		jsPlumb.ready(function() {
            //	var element = ReactDOM.findDOMNode(this);
            _this.instance = jsPlumb.getInstance({
                Endpoint: ["Blank", {}],
                Connector: "StateMachine",
                HoverPaintStyle: { strokeStyle: "#108151", lineWidth: 1 },
                ConnectionOverlays: [
                    ["Arrow", {
                        location: 1,
                        id: "arrow",
                        length: 10,
                        foldback: 0.4
                    }]
                ],
                Container: 'xml_container'
                });

            _this.instance.batch(function () {
                _this.newNode(_this.myTree);
            });

            var canvas = document.getElementById("xml_container");
            jsPlumb.on(canvas, "click", function (e) {
                if (e.target && e.target.id && _this.indexedNodes[e.target.id]) {
                        var myParentNode = _this.indexedNodes[e.target.id].obj;
                        _this.setState({ showModal: true, id: e.target.id, name: myParentNode.name, attributes: myParentNode.attributes ? myParentNode.attributes.slice(0) : [] });
                }
            });
            if(_this.props.match.params.id){
                httpHelper.get('/api/xmls/' + _this.props.match.params.id, (data)=>{
                    if(data.id > 0){
                        _this.load(data);
                        _this.setState({ xmlId: data.id, xmlName: data.name });
                    }
                });
            }
	    });
	}

    load = (data) => {
        var init = function (node) {
            for(var i = 0; i < node.childs.length; i++) {
                node.childs[i].parent = node;
                init(node.childs[i]);
            };
        }
        jsPlumb.empty("xml_container");
        this.instance.reset();
        this.myTree = data.tree;
        init(this.myTree);
        this.newNode(this.myTree);
        this.setLocation(this.myTree, 0, 0, 1);
	}	

    saveNode = () =>{
        var node = this.indexedNodes[this.state.id];
        node.obj.name = this.state.name;
        node.obj.attributes = this.state.attributes;
        node.el.innerHTML  = node.obj.name;
        this.close();
    }
    
    newChild = () => {
        var myParentNode = this.indexedNodes[this.state.id].obj;
        var myNode = { name: 'Child', childs: [], parent: myParentNode };
        myParentNode.childs.push(myNode);
        this.newNode(myNode);
        this.setLocation(this.myTree, 0, 0, 1);
        this.close();
    }  
    
    remove = () =>{
        var id = this.state.id;
        var node = this.indexedNodes[id];
        if (node.obj.parent && confirm('Are you sure?')) {
            var index = node.obj.parent.childs.indexOf(node.obj);
            node.obj.parent.childs.splice(index, 1);
            
            var instance = this.instance;
            var rmv = function (node) {
                for(var i = 0; i < node.childs.length; i++){
                    rmv(node.childs[i]);
                };
                instance.remove(node.id);
            }
            rmv(node.obj);


            if (node.obj.parent.childs.length > index) {
                this.initNode(this.indexedNodes[node.obj.parent.childs[index].id].el, node.obj.parent.childs[index]);
            }

            this.setLocation(this.myTree, 0, 0, 1);
            this.close();
        }        
    }

	close = () => {
		this.setState({ showModal: false });
    }
    
    inputChange = (name, e) => {
        this.setState({
            [name]: e.target.value
        });
    }	
    
    newAttribute = () => {
        this.setState({
            attributes: [...this.state.attributes, {name:'', value: ''}]
        });
	}    
    removeAttribute = (index) => {
        this.state.attributes.splice(index, 1);
        this.setState({
            attributes: this.state.attributes
        });
    } 
    
    attributeChange = (name, index, e) => {
        this.state.attributes[index][name] = e.target.value;
        this.setState({
            attributes: this.state.attributes
        });
    }	

    fileSelect = (e) => {
        httpHelper.upload('/api/xmls/upload', e.target.files[0], (data)=>{
            this.load(data);
            document.getElementById("fileElem").value = '';            
		});
    }    

    save = (validation) => {
        this.setState({ isTouched: true });		

        if(validation.isValid){        
            var getGraph = function (node) {
                var nNode = { name: node.name, attributes: node.attributes, childs: [] };
                for(var i = 0; i < node.childs.length; i++) {
                    nNode.childs.push(getGraph(node.childs[i]));
                };
                return nNode;
            }
            var data = {name: this.state.xmlName, node: getGraph(this.myTree)};
            if(this.state.xmlId > 0){
                httpHelper.put('/api/xmls/' + this.state.xmlId, data, ()=>{
                    this.props.history.push('/xmls');
                });
            }else{
                httpHelper.post('/api/xmls', data, ()=>{
                    this.props.history.push('/xmls');
                });
            }
        }
    }

    render() { 
        var validation = summary({
            xmlName: [isRequired(this.state.xmlName)]
        });	        
      return (
          <AvContent title='Xml'>			
				<div id='xml_wrapper'>	
                    <Modal show={this.state.showModal} onHide={()=>this.close()}>
                        <Modal.Header closeButton><Modal.Title>Tag</Modal.Title></Modal.Header>
                        <Modal.Body>
                                    <form>
                                            <div>
                                                <input name='name' value={this.state.name} onChange={(e)=>this.inputChange('name', e)} type="text" className="form-control" placeholder="Tag name" />
                                            </div>
                                            <div className='xml_new_attribute'>
                                                <button type="button" onClick={this.newAttribute} className="btn btn-default btn-xs pull-right"><i className="fa fa-plus"></i> Add attribute</button>
                                            </div>
                                            <div className="xml_attributes">
                                                <div className="form-inline">
                                                {this.state.attributes ? this.state.attributes.map((item, index) => (
                                                    <div key={index}>
                                                        <div className="form-group mr-15">
                                                            <input type="text" className="form-control" onChange={(e)=>this.attributeChange('name', index, e)} value={item.name} placeholder='name...' />
                                                        </div>
                                                        <div className="form-group mr-15">
                                                            <input type="text" className="form-control" onChange={(e)=>this.attributeChange('value', index, e)} value={item.value} placeholder='value...' />
                                                        </div>	 
                                                        <div className="form-group">
                                                            <button type='button' className="btn btn-danger btn-outline btn-rounded" onClick={()=>this.removeAttribute(index)}><i className="fa fa-remove"></i></button>
                                                        </div>                                                  
                                                    </div>																
                                                )) : ''}										
                                                </div>
                                            </div>                                           
                                    </form>
                        </Modal.Body>
                                <Modal.Footer>
                                        <button type="button" className="btn btn-info waves-effect" onClick={this.saveNode}>Save</button>
                                        <button type="button" className="btn btn-info waves-effect" onClick={this.newChild}>New child</button>                                     
                                        <button type="button" className="btn btn-default waves-effect" onClick={this.close}>Close</button>
                                        <button className="btn btn-danger btn-icon-anim" onClick={this.remove}><i className="icon-trash"></i></button>
                                </Modal.Footer>
                    </Modal>
                <div className='form-wrap'>
                    <div className={`form-group ${errorClass(validation.xmlName, this.state.isTouched)}`}>
                        <label className="control-label mb-10 text-left">Name</label>
                        <input type="text" className="form-control" value="Name..."  value={this.state.xmlName} onChange={(e)=>this.inputChange('xmlName', e)} />
                    </div>
                    {this.state.xmlId > 0 ? '' :
                    (<div className="mt-25">
                        <button className="btn btn-default btn-rounded" onClick={()=>document.getElementById("fileElem").click()}>Import</button>
                        <input type="file" id="fileElem" accept="xml/*" className="hidden" onChange={this.fileSelect} />
                    </div>)}
                    <div className="mt-25">
                        <button className="btn btn-success btn-rounded" onClick={()=>this.save(validation)}>Save</button>
                        <Link className="btn btn-default btn-rounded" to="/xmls" >To list</Link>        
                    </div>
                    <br/>
                </div>
               

			   <div id='xml_container'></div>
				</div>
        </AvContent>        
      )
    }
}