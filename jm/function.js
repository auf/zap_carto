 
$(function() {
	$( "body>[data-role='panel']" ).panel();
	$( "#mention_legal" ).enhanceWithin().popup();
	$('#rechercher_formation').bind( "tap", envoie_formulaire );
	var niveau_url =  'http://www.formations.univ-ap.info/basemodel/api_niveau_list/';
	//var discipline_url = 'http://outils.vn.auf.org/basemodel/api_discipline_list/';
	var discipline_url = 'http://www.formations.univ-ap.info/basemodel/api_discipline_principale_list/';
	var etab_url ='http://www.formations.univ-ap.info/basemodel/api_etab_list/';
	var pays_url = 'http://www.formations.univ-ap.info/basemodel/api_pays_list/';
	if (navigator.appVersion.indexOf("Mac OS")!=-1){
		
		$('.headerpage').find('a').remove();
		$('.headerpage').append('<a style="position:absolute;top:30px; left:10px; "  data-role="button" data-rel="back" data-transition="slide" data-icon="arrow-l" data-iconpos="left" class="ui-btn-left ui-btn ui-icon-arrow-l  ui-corner-all ui-btn-icon-notext"  > Retour </a>');
		$('[data-role="header"]').prepend('<div style="background-color: #ababab;top:0px;" id="transparent_header" class="ios-detected">   &nbsp;</div>	<a href="#mention_legal" data-icon="grid" data-rel="popup" class="ui-btn-right ui-btn ui-icon-grid  ui-corner-all ui-btn-icon-notext" data-iconpos="right" data-transition="pop" style="position:absolute;top:30px"></a><div id=""><div  class="logo paddingleft" ><img src="images/mb-logo-tracuu.png" />	</div></div> ');	
		$('#headerindex .logo').removeClass('paddingleft');
		
	}else{
		$('[data-role="header"]').prepend('	<a style="" href="#mention_legal" data-rel="popup" data-icon="grid" class="ui-btn-right ui-btn ui-icon-grid  ui-corner-all ui-btn-icon-notext" data-iconpos="right" data-transition="pop"></a><div class="logo paddingleft" ><img src="images/mb-logo-tracuu.png" />	</div> ');
		$('#headerindex .logo').removeClass('paddingleft');
	}


	var viewport = {
    width  : $(window).width(),
    height : $(window).height()
	};
	loaddata(pays_url,'code', 'nom','Pays');
	$(document).on('tap','#resultat_recherche ul li.formation', function() {
     
	      
		details = $(this).attr('data-title');
		lien_details = 'http://www.formations.univ-ap.info/cartographie/formation-francophone/mobile-'+details;
		frame ='<IFRAME id="frameId" src="'+lien_details+'" width="100%"  scrolling=auto frameborder=0 > </IFRAME>';
		theframe = $(frame);
		//theframe.appendTo($("#contenusite"));		
		$("#contenusite").html(theframe);
		$.mobile.initializePage();		
		$.mobile.changePage('#details', "slide", true, true);
		$("#frameId").load(function() {
			
			$(this).height( viewport.height );
		});
		$('body').find('#details').page();
						
    });  
	
	function envoie_formulaire(){
		$('#loading').show();
		$('#resultat_recherche').html('');
	
	pays = $("#Pays").val(); 
	etablissement = $("#Etablissement").val();
	discipline = $("#Discipline").val();
	niveau = $("#Niveau").val();
	url1 = '';
	if(pays!= 'Pays' && pays != '0'){
       url1 += "&etablissement__pays__code_iso3="+pays;
    }
	if(etablissement !='Etablissement' && etablissement != '0'){
		 url1 += "&etablissement="+etablissement;
	}
	
	if(discipline !='Discipline' && discipline != '0'){
		 url1 += "&search="+discipline;
	}
	if(niveau !='Niveau'  && niveau != '0'){
		url1 += "&niveau_diplome__id="+niveau;
	}
	
	url = "https://cartographie.auf.org/etablissement/api/?etablissement__region__nom=Asie-Pacifique"+ url1;
    url += "&ordering=etablissement__nom&format=jsonp";
	
//	var test = 'Romaric est le fils du Dieu tout puissant';
//	alert(url);
	
	var resultat ='';
	ajax(url);

}
function loaddata(theurl,codes, noms,id){
	theurl+= '?page_size=500';
	 $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: theurl,
		timeout: 40000,
		crossDomain: true,
		success: function (responseData, textStatus, jqXHR) {
			
				var datas = responseData.results;
				var html = '<label for="'+id+'" class="select">'+id+'</label>';
				html += '<select name="'+id+'" data-native-menu="false" id="'+id+'">';
				html += '<option> '+id+' </option>';
				html += '<option value="0"> ------------ </option>';
				for(i=0;i<datas.length;i++ ){
					html += '<option value="'+datas[i][codes]+'"> '+datas[i][noms]+' </option>';
				}
				
				
				html += '</select>';
				
				$("#form").append(html);
				
				if(id =='Pays'){
					loaddata(etab_url,'code', 'nom','Etablissement');
				}
				if(id =='Etablissement'){
					loaddata(discipline_url,'code', 'nom','Discipline');
				}
				if(id =='Discipline'){
					loaddata(niveau_url,'code', 'designation','Niveau');
				}
				
				//$.mobile.changePage('#home', "slide", true, true);
				if(id =='Niveau'){
					$('#home').page();
					$('#loading').hide();
					setTimeout(function(){$.mobile.changePage('#home', "slide", true, true)}, 3000);
					//$.mobile.changePage('#home', {transition:'slide'})
				}
					
	
				
				
		},
		error: function (responseData, textStatus, errorThrown) {
				if(textStatus == 'timeout')
				{    $('#loading').hide(); 
					alert('Vérifiez votre connexion internet'); 
					
				}
		}
	});
}
function ajax(theurl){
	theurl+= '&page_size=700';
	aaa=  $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: theurl,
		timeout:120000,
		crossDomain: true,
		success: function (responseData, textStatus, jqXHR) {
		if (responseData.count != 0){	
			var datas = responseData.results;
			var template='';
			var encours ='';
			var encours_nom ='';
			var nbre = 1;

			for(i=0;i<datas.length;i++ ){
				
				if(encours != datas[i].etablissement.id){
					if(encours!='')
						{ template +=' </ul> <h5 >'+encours_nom+'<span class="ui-li-count">'+nbre+'</span></h5></div>';
						nbre =1;
						}
		
					template +='<div data-role="collapsible" data-theme="a" class="collapse">';
					template +=' <ul data-role="listview" data-theme="a" data-divider-theme="b" class="ui-listview">';
					template +=' <li data-role="list-divider" class="first">'+datas[i].etablissement.nom+' </li>';
					template +='  <li class="formation" data-title="'+datas[i].id+'"><a href="#">';
					template +='  <h5 class="white-space">'+datas[i].nom+'</h5>';
		
					if(datas[i].niveau_diplome == null){
						template +=' <p><strong>' +'</strong> '+datas[i].etablissement.pays.nom+' </p></a></li>';	
					}else{
						template +=' <p><strong>'+datas[i].niveau_diplome.nom +'</strong> '+datas[i].etablissement.pays.nom+' </p></a></li>';
					}
	   
					encours_nom =datas[i].etablissement.nom;
					encours = datas[i].etablissement.id;
         
       
					}else
					{
						nbre++;
						template +='  <li class="formation" data-title="'+datas[i].id+'"><a href="#">';
						template +='  <h5 class="white-space">'+datas[i].nom+'</h5>';
						template +=' <p><strong>'+datas[i].niveau_diplome.nom +'</strong> '+datas[i].etablissement.pays.nom+' </p></a></li>';	   
					}
    
			}
	
			template +=' </ul> <h5 >'+encours_nom+'<span class="ui-li-count">'+nbre+'</span></h5></div>';
							
			$('#resultat_recherche').append(template);
				
				
				
			$('#resultat_recherche .ui-listview').listview();
			$('#resultat_recherche .collapse').collapsible();
			$('#loading').hide();
			$('#resultat').page();
					
			setTimeout(function(){$.mobile.changePage('#resultat', "slide", true, true)}, 3000);
		}else{
			$('#loading').hide();
			alert('Aucune formation trouvée.');

		}
				
				
		},
		error: function (responseData, textStatus, errorThrown) {
				if(textStatus == 'timeout')
			{     
				$('#loading').hide();
				alert('Vérifiez votre connexion internet'); 
				//do something. Try again perhaps?
			}
		},
		details_formation: function(){
			alert('pourquoi?');
		}
	});
	
}
$("#index").page();
});

