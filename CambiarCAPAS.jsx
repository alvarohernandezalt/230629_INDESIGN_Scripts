//DESCRIPCIÓN: Apagar/Encender capas en un Libro
// KALAM Scripts Alvaro Hernández

if (app.books.length != 1)
{
	alert ("¡Por favor! Comprueba que solo hay un libro abierto al mismo tiempo. Si no es imposible que este script pueda funcionar y todo se irá al traste...");
	exit(0);
}

docList = [];
layerList = [];
for (d=0; d<app.books[0].bookContents.length; d++)
{
	oneDoc = app.open(app.books[0].bookContents[d].fullName);
	docList.push (oneDoc);
	if (d == 0)
	{
	//	Add all of them from the first doc.
		layerList = oneDoc.layers.everyItem().name;
		layerList.sort();
	} else
	{
		newlist = oneDoc.layers.everyItem().name;
	//	Remove ones not in the next doc.
		for (l=0; l<layerList.length; l++)
		{
			if (!isInList (newlist, layerList[l]))
				layerList.splice (l,1);
		}
	}
}

if (layerList.length == 0)
{
	alert ("No existen capas con el mismo nombre en todo el libro. Por favor, revisa los documentos que lo componen");
	exit(0);
}

myDialog = app.dialogs.add ({name:"Enciende/Apaga capas del Libro",canCancel:true});

checkList = [];

with (myDialog)
{
	with (dialogColumns.add())
	{
		with (borderPanels.add())
		{
			with (dialogColumns.add())
			{
				for (l=0; l<layerList.length; l++)
					with (dialogRows.add())
						checkList.push (checkboxControls.add ({staticLabel:layerList[l], checkedState:docList[0].layers.item(layerList[l]).visible}));
				with (dialogRows.add())
					staticTexts.add ({staticLabel:"Marca la casilla para que la capa se encienda, desmarca para que se apague"});
			}
		}
		with (dialogRows.add())
		{
			with (radiobuttonGroups.add())
			{
				none = radiobuttonControls.add({staticLabel:"Deja abiertos los documentos", checkedState:true});
				save = radiobuttonControls.add({staticLabel:"Guarda después de los cambios", checkedState:false});
				close = radiobuttonControls.add({staticLabel:"Guarda y cierra tras los cambios", checkedState:false});
			}
		}
	}
}
if (!myDialog.show())
{
	myDialog.destroy();
	exit(0);
}

for (check=0; check < checkList.length; check++)
{
	for (d=0; d<docList.length; d++)
	{
		docList[d].layers.item (layerList[check]).visible = checkList[check].checkedState;
	}
}

if (close.checkedState == true)
{
	for (d=0; d<docList.length; d++)
	{
		docList[d].close (SaveOptions.YES);
	}
}

if (save.checkedState == true)
{
	for (d=0; d<docList.length; d++)
	{
		docList[d].save ();
	}
}

function isInList (list, item)
{
	var l;
	
	for (l=0; l<list.length; l++)
		if (list[l] == item)
			return true;
	return false;
}
