console.log('inicio de CRM');
var seler_name = "Andres Perez";
var databaseUrl = "http://smartmanagement.ec/fundelcrm/database.php";
function contact(val){
	
	str = '<div class="w3-card-4" style="width:100%; background-color:#FFF"><header class="w3-container w3-light-grey"><h5>'+val.nombre+'</h5></header><div class="w3-container"><img src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/396f2d24539351.56335ec733642.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px; height:75px; padding-top:15px;"><p>'+val.telefono+', edad '+val.edad+'</p><p class="ampliar">+Detalles...</p><div class="oculto"><p>'+val.curso+'</p><p>'+val.ciudad+'</p><p>fecha de inicio: '+val.f_inicio+'</p><p>ingreso de datos: '+val.fecha+'</p><p>'+val.correo+'</p><p>Proxima fecha: '+val.f_proxima+'</p><p>Forma de contacto: '+val.forma_contacto+'</p><p>Notas: '+val.notas+'</p></div></div></div>';
	
	return str;		
}

function addUser(ui, val) {
	
	val.f_proxima = $('#next-date').val();
	val.forma_contacto = $('#mode').val();
	val.notas = $('#note').val();
	val.transaccion = "process";
	val.vendedor = seler_name;
	val.old_id = val.id;
	
	if($("#process-"+val.id).length){
		$("#process-"+val.id).remove();	
	}
	
	if((val.f_proxima != "") && (val.forma_contacto != "") && (val.notas != "")){	
		dialog.dialog( "close" );
		if(ui != null)
			ui.draggable.remove();
		
		card = $('<div />',{
			class: "drag",
			style: "padding:5px 5px 5px 5px",
			id: "process-" + val.id,
			html: contact(val)
		}).draggable({
			revert: 'invalid',
			containment: $('#container1'),
			helper: 'clone',
			stack: ".drag"
		});
			
		btn = $('<button />',{
			class: "w3-btn-block w3-deep-purple",
			id: "bt-" + val.id,
			html:'Re-Agendar'
		}).click(function(event){
			old_id = event.target.id;
			old_id = old_id.substring(old_id.indexOf('-') + 1);
			$.post( databaseUrl, { operacion: "id_contacto", id: old_id }).done(function(dat1) {
				obj = $.parseJSON(dat1);
				$('#name').val(obj.nombre);
				$('#age').val(obj.edad);
				$('#email').val(obj.correo);
				$('#phone').val(obj.telefono);
				$('#city').val(obj.ciudad);
				$('#subject').val(obj.curso);
				$('#start').val(obj.f_inicio);
				$('#ingress').val(obj.fecha);
				$('#next-date').val("");
				$('#mode').val("");
				$('#note').val("");
					
				dialog = dialog.dialog({
					buttons: {
						"Agendar" : function() {
							addUser(null, obj);
						},
						"Cancelar" : function() {
							dialog.dialog( "close" );
						}
					}
				});					
				dialog.dialog( "open" );					
			});
		});
			
		btn.appendTo(card);
		card.appendTo('#col2');
		
		$.post( databaseUrl, { operacion: "contact_disponible", id: val.id }).done(function(dat) {});
		$.post( databaseUrl, { operacion: "process_insertar", data: val }).done(function(dat) {});	  	
	}
	else{
		alert("Debes llenar los campos marcados con (*)");		
	}
}


function acceptUser(ui, val) {
	
	val.notas = $('#accept-note').val();
	val.transaccion = "accept";
	val.vendedor = seler_name;
	
	if(val.notas != ""){	
		dialog2.dialog( "close" );
		ui.draggable.remove();
		$('<div />',{
			class: "drag",
			style: "padding:5px 5px 5px 5px",
			id: "accept-" + val.old_id,
			html: contact(val)
		}).prependTo('#col3');
		
		$.post( databaseUrl, { operacion: "accept_insertar", id: val.old_id }).done(function(dat) {});	  	
	}
	else{
		alert("Debes llenar los campos marcados con (*)");		
	}
}

function rejectUser(ui, val) {
	
	val.notas = $('#reject-note').val();
	val.transaccion = "reject";
	val.vendedor = seler_name;
	
	if(val.notas != ""){	
		dialog3.dialog( "close" );
		ui.draggable.remove();
		$('<div />',{
			class: "drag",
			style: "padding:5px 5px 5px 5px",
			id: "reject-" + val.id,
			html: contact(val)
		}).prependTo('#col4');
		
		$.post( databaseUrl, { operacion: "reject_insertar", id: val.old_id }).done(function(dat) {});	  	
	}
	else{
		alert("Debes llenar los campos marcados con (*)");		
	}
}

$(document).ready(function(){
	
	dialog = $( "#dialog-form" ).dialog({
		autoOpen: false,
		modal: true,
		width: 500
	});
	
	dialog2 = $( "#dialog-form2" ).dialog({
		autoOpen: false,
		modal: true,
		width: 500
	});
	
	dialog3 = $( "#dialog-form3" ).dialog({
		autoOpen: false,
		modal: true,
		width: 500
	});
	
	$('.w3-pale-green');
	$('.w3-pale-yellow');
	$('.w3-pale-red');
	
	$.post( databaseUrl, { operacion: "contactos" }).done(function(dat) {		
		obj = $.parseJSON(dat)
		$.each(obj, function(index, val){
			$('<div />',{
				class: "drag",
				style: "padding:5px 5px 5px 5px",
				id: "contact-" + val.id,
				html: contact(val)
			})
			.appendTo('#col1')
			.draggable({
				revert: 'invalid',
				containment: $('#container1'),
				helper: 'clone',
				stack: ".drag"
			});
		});
    });
	
	$.post( databaseUrl, { operacion: "procesados" }).done(function(dat) {	
		console.log('funcion Procesados en ejeccion...');
		obj = $.parseJSON(dat)
		$.each(obj, function(index, val){
			card = $('<div />',{
				class: "drag",
				style: "padding:5px 5px 5px 5px",
				id: "process-" + val.old_id,
				html: contact(val)
			}).draggable({
				revert: 'invalid',
				containment: $('#container1'),
				helper: 'clone',
				stack: ".drag"
			});
			
			btn = $('<button />',{
				class: "w3-btn-block w3-deep-purple",
				id: "bt-" + val.old_id,
				html:'Re-Agendar'
			}).click(function(event){
				old_id = event.target.id;
				old_id = old_id.substring(old_id.indexOf('-') + 1);
				$.post( databaseUrl, { operacion: "id_contacto", id: old_id }).done(function(dat1) {
					obj = $.parseJSON(dat1);
					$('#name').val(obj.nombre);
					$('#age').val(obj.edad);
					$('#email').val(obj.correo);
					$('#phone').val(obj.telefono);
					$('#city').val(obj.ciudad);
					$('#subject').val(obj.curso);
					$('#start').val(obj.f_inicio);
					$('#ingress').val(obj.fecha);
					$('#next-date').val("");
					$('#mode').val("");
					$('#note').val("");
					
					dialog = dialog.dialog({
						buttons: {
							"Agendar" : function() {
								addUser(null, obj);
							},
							"Cancelar" : function() {
								dialog.dialog( "close" );
							}
						}
					});					
					dialog.dialog( "open" );					
				});
			});
			
			btn.appendTo(card);
			card.appendTo('#col2');		  
		});
    });
	
	
	$.post( databaseUrl, { operacion: "aceptados" }).done(function(dat) {		
		obj = $.parseJSON(dat)
		$.each(obj, function(index, val){
			$('<div />',{
				class: "drag",
				style: "padding:5px 5px 5px 5px",
				id: "accept-" + val.old_id,
				html: contact(val)
			}).appendTo('#col3');
		});
    });
	
	$.post( databaseUrl, { operacion: "rechazados" }).done(function(dat) {		
		obj = $.parseJSON(dat)
		$.each(obj, function(index, val){
			$('<div />',{
				class: "drag",
				style: "padding:5px 5px 5px 5px",
				id: "reject-" + val.old_id,
				html: contact(val)
			}).appendTo('#col4');
		});
    });
	
	
	$( "#col2" ).droppable({
		accept: "#col1 div",
		drop: function( event, ui ){			
			old_id = ui.draggable.attr('id');
			old_id = old_id.substring(old_id.indexOf('-') + 1);
			$.post( databaseUrl, { operacion: "id_contacto", id: old_id }).done(function(dat1) {
				obj = $.parseJSON(dat1);
				if(obj.disponible == 1){
					$('#name').val(obj.nombre);
					$('#age').val(obj.edad);
					$('#email').val(obj.correo);
					$('#phone').val(obj.telefono);
					$('#city').val(obj.ciudad);
					$('#subject').val(obj.curso);
					$('#start').val(obj.f_inicio);
					$('#ingress').val(obj.fecha);
					$('#next-date').val("");
					$('#mode').val("");
					$('#note').val("");
					
					dialog = dialog.dialog({
						buttons: {
							"Agendar" : function() {
								addUser(ui, obj);
							},
							"Cancelar" : function() {
								dialog.dialog( "close" );
							}
						}
					});
					
					dialog.dialog( "open" );
				}
				else{
					alert("Este contacto ya no se encuentra disponible");	
					ui.draggable.remove();				
				}
			}); 				
		}
	});	
	
	$( "#col3" ).droppable({
		accept: "#col2 div",
		drop: function( event, ui ){			
			old_id = ui.draggable.attr('id');
			old_id = old_id.substring(old_id.indexOf('-') + 1);
						
			$.post( databaseUrl, { operacion: "id_proceso", id: old_id }).done(function(dat) {
				
				obj = $.parseJSON(dat);
				
				$('#accept-name').val(obj.nombre);					
				dialog2 = dialog2.dialog({
					buttons: {
						"Agendar" : function() {
							acceptUser(ui, obj);
						},
						"Cancelar" : function() {
							dialog2.dialog( "close" );
						}
					}
				});
				
				dialog2.dialog( "open" );
								
			});			 				
		}
    });	
	
	$( "#col4" ).droppable({
		accept: "#col2 div",
		drop: function( event, ui ){			
			old_id = ui.draggable.attr('id');
			old_id = old_id.substring(old_id.indexOf('-') + 1);
			
			$.post( databaseUrl, { operacion: "id_proceso", id: old_id }).done(function(dat) {
				
				obj = $.parseJSON(dat);
				
				$('#reject-name').val(obj.nombre);					
				dialog3 = dialog3.dialog({
					buttons: {
						"Agendar" : function() {
							rejectUser(ui, obj);
						},
						"Cancelar" : function() {
							dialog3.dialog( "close" );
						}
					}
				});
					
				dialog3.dialog( "open" );
								
			});			 				
		}
    });			
})