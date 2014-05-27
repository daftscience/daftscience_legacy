from collections import OrderedDict
ueoCells = OrderedDict()
ueoCells['Eosinophils']     = 'eos'
ueoCells['Others']          = 'other'

ueoKeys = OrderedDict()
ueoKeys['Eosinophils']      = "3"
ueoKeys['Others']           = "2"

diffCells = OrderedDict()
diffCells['Neutrophils']    = 'neut'
diffCells['Bands Cells']    = 'band'
diffCells['Lymphocytes']    = "lymph"
diffCells['Monocytes']      = "mono"
diffCells['Eosinophils']    = "eos"
diffCells['Basophils']      = "baso"
diffCells['Metamyelocytes'] = "meta"
diffCells['Myelocytes']     = "myelo"
diffCells['Promyelocytes']  = "pro"
diffCells['Blasts']         = "blast"
diffCells['NRBCs']          = "nrbc"
diffCells['Others']         = "other"
diffCells['Megakaryocytes'] = "mega"
diffCells['Plasma Cells']   = "plasma"

diffKeys = OrderedDict()
diffKeys['Neutrophils']     =  "2"
diffKeys['Bands Cells']     =  "1"
diffKeys['Lymphocytes']     =  "3"
diffKeys['Monocytes']       =  "6"
diffKeys['Eosinophils']     =  "5"
diffKeys['Basophils']       =  "4"
diffKeys['Metamyelocytes']  =  "7"
diffKeys['Myelocytes']      =  "8"
diffKeys['Promyelocytes']   =  "9"
diffKeys['Blasts']          =  " . "
diffKeys['NRBCs']           =  "0 -zero"
diffKeys['Others']          =  "o -letter"
diffKeys['Megakaryocytes']  =  "*"
diffKeys['Plasma Cells']    =  "/" 