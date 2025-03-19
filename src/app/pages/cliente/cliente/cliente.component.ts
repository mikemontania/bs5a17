import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../interfaces/clientes.interface';
import { CommonModule } from '@angular/common';
import { ListaPrecioService } from '../../../services/listaPrecio.service';
import { CondicionPagoService } from '../../../services/condicionPago.service';
import { ClientesService } from '../../../services/clientes.service';
import { ListaPrecio } from '../../../interfaces/listaPrecio.interface';
import { CondicionPago } from '../../../interfaces/condicionPago.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit {
  id = signal<number>(0)
  listas = signal<ListaPrecio[]>([])
  formas = signal<CondicionPago[]>([])
  clienteForm: FormGroup ;
  paises :any[]=[...paises_codigos]
   private fb = inject(FormBuilder)
  private _listaPrecioService = inject(ListaPrecioService)
  private _formadocumentoService = inject(CondicionPagoService)
  private _clienteService = inject(ClientesService)
  private activatedRoute= inject(ActivatedRoute);
  private router= inject(Router);
  constructor() {
    // Initialize the property in the constructor
    this.clienteForm = this.initForm()

    forkJoin([
      this._listaPrecioService.findAll(),
      this._formadocumentoService.findAll(),

    ]).subscribe(([listas, formas]) => {
      this.listas.set(listas);
      this.formas.set(formas);
    });

  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id)
      if ( id) {
        this.id.set(+id || 0); // Maneja la posibilidad de valor nulo
        this._clienteService.getById( this.id()).subscribe({
          next: (clienteData) => {
            this.clienteForm?.patchValue(clienteData);  // Use optional chaining to prevent null errors
          },
          error: message => {
            console.error(message);
            // Maneja el error de forma adecuada (por ejemplo, mostrando un mensaje al usuario)
          }
        });
      }
    });

    this.clienteForm.get('naturalezaReceptor')?.valueChanges.subscribe(value => {
      const tipoDocIdentidadControl = this.clienteForm.get('tipoDocIdentidad');

      if (value == 2) {
        // Si es Persona Física, hacer obligatorio
        tipoDocIdentidadControl?.setValidators([Validators.required]);
      } else {
        // Si es otro tipo, quitar la validación y resetear el campo
        tipoDocIdentidadControl?.clearValidators();
        tipoDocIdentidadControl?.setValue(null);
      }
      tipoDocIdentidadControl?.updateValueAndValidity();
    });

  }
initForm(){
  return this.fb.group({
    empresaId: [1, Validators.required],
    listaPrecioId: [1, Validators.required],
    condicionPagoId: [1, Validators.required],
    razonSocial: [null, [Validators.required, Validators.minLength(7)]],
    nombreFantasia: [null ],
    nroDocumento: [null, [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    direccion: [null, Validators.required],
    telefono: [null, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(6),
      Validators.maxLength(15)
    ]],
    cel: [null, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(10),
      Validators.maxLength(15)
    ]],
    email: [null, [Validators.required, Validators.email]],
    excentoIva: [false],
    latitud: [null],
    longitud: [null],
    predeterminado: [false],
    empleado: [0],
    propietario: [false],
    activo: [true],
    tipoOperacionId: [null, [Validators.required, Validators.pattern(/^[1-4]$/)]],
    naturalezaReceptor: [null, [Validators.required, Validators.pattern(/^[1-2]$/)]],//1= contribuyente    2= no contribuyente
    codigoPais: ['PRY', [Validators.required, Validators.maxLength(3)]],
    tipoContribuyente: [null, [Validators.required, Validators.pattern(/^[1-2]$/)]], //1Persona Física 2Persona Jurídica
    tipoDocIdentidad: [null]
  });
}
  onSubmit(e:Event) {
    e.preventDefault()
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();

      // Log the errors to the console
      console.log(this.getFormErrors());

      return;
    }
    const clienteData: Cliente = this.clienteForm.value;
    Swal.showLoading();




    if (this.id()) {
      const cliente = {
        ...clienteData,
        razonSocial: clienteData.razonSocial.toUpperCase(),
        direccion: clienteData.direccion.toUpperCase(),
        id:this.id()
       }
      this._clienteService.update(cliente).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Actualización exitosa!!!", "Se ha actualizado al cliente: " + resp.razonSocial, "success");
          this.router.navigateByUrl('/clientes');

        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.clienteForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    } else {

      this._clienteService.create(clienteData).subscribe({
        next: (resp) => {
          Swal.close()
          Swal.fire("Creación exitosa!!!", "Se ha registrado el cliente " + resp.razonSocial, "success");
          this.router.navigateByUrl('/clientes');

        },
        error: (error) => {
          Swal.close()
          Swal.fire("Error", error, "error");
        },
        complete: () => {
          this.clienteForm = this.fb.group({});
        }// Use 'complete' instead of 'finally'
      });
    }

  }
  getFormErrors() {
    const errors: { field: string; errors: any }[] = [];

    Object.keys(this.clienteForm.controls).forEach(key => {
      const control = this.clienteForm.get(key);
      if (control && control.invalid && (control.touched || control.dirty)) {
        errors.push({ field: key, errors: control.errors });
      }
    });

    return errors;
  }
  toUpeCaseEvent(evento: string) {
    return evento.toLocaleUpperCase();
  }




}
export const paises_codigos = [
  { codigo: 'MKD', descripcion: 'Macedonia del Norte' },
  { codigo: 'TWN', descripcion: 'Taiwán (Provincia de China)' },
  { codigo: 'DZA', descripcion: 'Argelia' },
  { codigo: 'EGY', descripcion: 'Egipto' },
  { codigo: 'LBY', descripcion: 'Libia' },
  { codigo: 'MAR', descripcion: 'Marruecos' },
  { codigo: 'SDN', descripcion: 'Sudán' },
  { codigo: 'TUN', descripcion: 'Túnez' },
  { codigo: 'ESH', descripcion: 'Sáhara Occidental' },
  { codigo: 'IOT', descripcion: 'Territorio Británico del Océano Índico' },
  { codigo: 'BDI', descripcion: 'Burundi' },
  { codigo: 'COM', descripcion: 'Comoras' },
  { codigo: 'DJI', descripcion: 'Djibouti' },
  { codigo: 'ERI', descripcion: 'Eritrea' },
  { codigo: 'ETH', descripcion: 'Etiopía' },
  { codigo: 'ATF', descripcion: 'Territorio de las Tierras Australes Francesas' },
  { codigo: 'KEN', descripcion: 'Kenya' },
  { codigo: 'MDG', descripcion: 'Madagascar' },
  { codigo: 'MWI', descripcion: 'Malawi' },
  { codigo: 'MUS', descripcion: 'Mauricio' },
  { codigo: 'MYT', descripcion: 'Mayotte' },
  { codigo: 'MOZ', descripcion: 'Mozambique' },
  { codigo: 'REU', descripcion: 'Reunión' },
  { codigo: 'RWA', descripcion: 'Rwanda' },
  { codigo: 'SYC', descripcion: 'Seychelles' },
  { codigo: 'SOM', descripcion: 'Somalia' },
  { codigo: 'SSD', descripcion: 'Sudán del Sur' },
  { codigo: 'UGA', descripcion: 'Uganda' },
  { codigo: 'TZA', descripcion: 'República Unida de Tanzanía' },
  { codigo: 'ZMB', descripcion: 'Zambia' },
  { codigo: 'ZWE', descripcion: 'Zimbabwe' },
  { codigo: 'AGO', descripcion: 'Angola' },
  { codigo: 'CMR', descripcion: 'Camerún' },
  { codigo: 'CAF', descripcion: 'República Centroafricana' },
  { codigo: 'TCD', descripcion: 'Chad' },
  { codigo: 'COG', descripcion: 'Congo' },
  { codigo: 'COD', descripcion: 'República Democrática del Congo' },
  { codigo: 'GNQ', descripcion: 'Guinea Ecuatorial' },
  { codigo: 'GAB', descripcion: 'Gabón' },
  { codigo: 'STP', descripcion: 'Santo Tomé y Príncipe' },
  { codigo: 'BWA', descripcion: 'Botswana' },
  { codigo: 'LSO', descripcion: 'Lesotho' },
  { codigo: 'NAM', descripcion: 'Namibia' },
  { codigo: 'ZAF', descripcion: 'Sudáfrica' },
  { codigo: 'SWZ', descripcion: 'Swazilandia' },
  { codigo: 'BEN', descripcion: 'Benin' },
  { codigo: 'BFA', descripcion: 'Burkina Faso' },
  { codigo: 'CPV', descripcion: 'Cabo Verde' },
  { codigo: 'CIV', descripcion: "Côte d'Ivoire" },
  { codigo: 'GMB', descripcion: 'Gambia' },
  { codigo: 'GHA', descripcion: 'Ghana' },
  { codigo: 'GIN', descripcion: 'Guinea' },
  { codigo: 'GNB', descripcion: 'Guinea-Bissau' },
  { codigo: 'LBR', descripcion: 'Liberia' },
  { codigo: 'MLI', descripcion: 'Malí' },
  { codigo: 'MRT', descripcion: 'Mauritania' },
  { codigo: 'NER', descripcion: 'Níger' },
  { codigo: 'NGA', descripcion: 'Nigeria' },
  { codigo: 'SHN', descripcion: 'Santa Elena' },
  { codigo: 'SEN', descripcion: 'Senegal' },
  { codigo: 'SLE', descripcion: 'Sierra Leona' },
  { codigo: 'TGO', descripcion: 'Togo' },
  { codigo: 'AIA', descripcion: 'Anguila' },
  { codigo: 'ATG', descripcion: 'Antigua y Barbuda' },
  { codigo: 'ABW', descripcion: 'Aruba' },
  { codigo: 'BHS', descripcion: 'Bahamas' },
  { codigo: 'BRB', descripcion: 'Barbados' },
  { codigo: 'BES', descripcion: 'Bonaire, San Eustaquio y Saba' },
  { codigo: 'VGB', descripcion: 'Islas Vírgenes Británicas' },
  { codigo: 'CYM', descripcion: 'Islas Caimán' },
  { codigo: 'CUB', descripcion: 'CUBA' },
  { codigo: 'CUW', descripcion: 'Curaçao' },
  { codigo: 'DMA', descripcion: 'Dominica' },
  { codigo: 'DOM', descripcion: 'República Dominicana' },
  { codigo: 'GRD', descripcion: 'Granada' },
  { codigo: 'GLP', descripcion: 'Guadalupe' },
  { codigo: 'HTI', descripcion: 'Haití' },
  { codigo: 'JAM', descripcion: 'Jamaica' },
  { codigo: 'MTQ', descripcion: 'Martinica' },
  { codigo: 'MSR', descripcion: 'Montserrat' },
  { codigo: 'PRI', descripcion: 'Puerto Rico' },
  { codigo: 'BLM', descripcion: 'San Bartolomé' },
  { codigo: 'KNA', descripcion: 'Saint Kitts y Nevis' },
  { codigo: 'LCA', descripcion: 'Santa Lucía' },
  { codigo: 'MAF', descripcion: 'San Martín (parte francesa)' },
  { codigo: 'VCT', descripcion: 'San Vicente y las Granadinas' },
  { codigo: 'SXM', descripcion: 'San Martín (parte holandés)' },
  { codigo: 'TTO', descripcion: 'Trinidad y Tabago' },
  { codigo: 'TCA', descripcion: 'Islas Turcas y Caicos' },
  { codigo: 'VIR', descripcion: 'Islas Vírgenes de los Estados Unidos' },
  { codigo: 'BLZ', descripcion: 'Belice' },
  { codigo: 'CRI', descripcion: 'Costa Rica' },
  { codigo: 'SLV', descripcion: 'El Salvador' },
  { codigo: 'GTM', descripcion: 'Guatemala' },
  { codigo: 'HND', descripcion: 'Honduras' },
  { codigo: 'MEX', descripcion: 'México' },
  { codigo: 'NIC', descripcion: 'Nicaragua' },
  { codigo: 'PAN', descripcion: 'Panamá' },
  { codigo: 'ARG', descripcion: 'Argentina' },
  { codigo: 'BOL', descripcion: 'Bolivia (Estado Plurinacional de)' },
  { codigo: 'BRA', descripcion: 'Brasil' },
  { codigo: 'CHL', descripcion: 'Chile' },
  { codigo: 'COL', descripcion: 'Colombia' },
  { codigo: 'ECU', descripcion: 'Ecuador' },
  { codigo: 'FLK', descripcion: 'Islas Malvinas (Falkland)' },
  { codigo: 'GUF', descripcion: 'Guayana Francesa' },
  { codigo: 'GUY', descripcion: 'Guyana' },
  { codigo: 'PRY', descripcion: 'Paraguay' },
  { codigo: 'PER', descripcion: 'Perú' },
  { codigo: 'SGS', descripcion: 'Georgia del Sur y las Islas Sandwich del Sur' },
  { codigo: 'SUR', descripcion: 'Suriname' },
  { codigo: 'URY', descripcion: 'Uruguay' },
  { codigo: 'VEN', descripcion: 'Venezuela (República Bolivariana de)' },
  { codigo: 'BMU', descripcion: 'Bermuda' },
  { codigo: 'CAN', descripcion: 'Canadá' },
  { codigo: 'GRL', descripcion: 'Groenlandia' },
  { codigo: 'SPM', descripcion: 'Saint Pierre y Miquelon' },
  { codigo: 'USA', descripcion: 'Estados Unidos de América' },
  { codigo: 'ATA', descripcion: 'Antártida' },
  { codigo: 'KAZ', descripcion: 'Kazajstán' },
  { codigo: 'KGZ', descripcion: 'Kirguistán' },
  { codigo: 'TJK', descripcion: 'Tayikistán' },
  { codigo: 'TKM', descripcion: 'Turkmenistán' },
  { codigo: 'UZB', descripcion: 'Uzbekistán' },
  { codigo: 'CHN', descripcion: 'China' },
  { codigo: 'HKG', descripcion: 'China, región administrativa especial de Hong Kong' },
  { codigo: 'MAC', descripcion: 'China, región administrativa especial de Macao' },
  { codigo: 'PRK', descripcion: 'República Popular Democrática de Corea' },
  { codigo: 'JPN', descripcion: 'Japón' },
  { codigo: 'MNG', descripcion: 'Mongolia' },
  { codigo: 'KOR', descripcion: 'República de Corea' },
  { codigo: 'BRN', descripcion: 'Brunei Darussalam' },
  { codigo: 'KHM', descripcion: 'Camboya' },
  { codigo: 'IDN', descripcion: 'Indonesia' },
  { codigo: 'LAO', descripcion: 'República Democrática Popular Lao' },
  { codigo: 'MYS', descripcion: 'Malasia' },
  { codigo: 'MMR', descripcion: 'Myanmar' },
  { codigo: 'PHL', descripcion: 'Filipinas' },
  { codigo: 'SGP', descripcion: 'Singapur' },
  { codigo: 'THA', descripcion: 'Tailandia' },
  { codigo: 'TLS', descripcion: 'Timor-Leste' },
  { codigo: 'VNM', descripcion: 'Viet Nam' },
  { codigo: 'AFG', descripcion: 'Afganistán' },
  { codigo: 'BGD', descripcion: 'Bangladesh' },
  { codigo: 'BTN', descripcion: 'Bhután' },
  { codigo: 'IND', descripcion: 'India' },
  { codigo: 'IRN', descripcion: 'Irán (República Islámica de)' },
  { codigo: 'MDV', descripcion: 'Maldivas' },
  { codigo: 'NPL', descripcion: 'Nepal' },
  { codigo: 'PAK', descripcion: 'Pakistán' },
  { codigo: 'LKA', descripcion: 'Sri Lanka' },
  { codigo: 'ARM', descripcion: 'Armenia' },
  { codigo: 'AZE', descripcion: 'Azerbaiyán' },
  { codigo: 'BHR', descripcion: 'Bahrein' },
  { codigo: 'CYP', descripcion: 'Chipre' },
  { codigo: 'GEO', descripcion: 'Georgia' },
  { codigo: 'IRQ', descripcion: 'Iraq' },
  { codigo: 'ISR', descripcion: 'Israel' },
  { codigo: 'JOR', descripcion: 'Jordania' },
  { codigo: 'KWT', descripcion: 'Kuwait' },
  { codigo: 'LBN', descripcion: 'Líbano' },
  { codigo: 'OMN', descripcion: 'Omán' },
  { codigo: 'QAT', descripcion: 'Qatar' },
  { codigo: 'SAU', descripcion: 'Arabia Saudita' },
  { codigo: 'PSE', descripcion: 'Estado de Palestina' },
  { codigo: 'SYR', descripcion: 'República Árabe Siria' },
  { codigo: 'TUR', descripcion: 'Turquía' },
  { codigo: 'ARE', descripcion: 'Emiratos Árabes Unidos' },
  { codigo: 'YEM', descripcion: 'Yemen' },
  { codigo: 'BLR', descripcion: 'Belarús' },
  { codigo: 'BGR', descripcion: 'Bulgaria' },
  { codigo: 'CZE', descripcion: 'Chequia' },
  { codigo: 'HUN', descripcion: 'Hungría' },
  { codigo: 'POL', descripcion: 'Polonia' },
  { codigo: 'MDA', descripcion: 'República de Moldova' },
  { codigo: 'ROU', descripcion: 'Rumania' },
  { codigo: 'RUS', descripcion: 'Federación de Rusia' },
  { codigo: 'SVK', descripcion: 'Eslovaquia' },
  { codigo: 'UKR', descripcion: 'Ucrania' },
  { codigo: 'ALA', descripcion: 'Islas Åland' },
  { codigo: 'GGY', descripcion: 'Guernsey' },
  { codigo: 'JEY', descripcion: 'Jersey' },
  { codigo: 'DNK', descripcion: 'Dinamarca' },
  { codigo: 'EST', descripcion: 'Estonia' },
  { codigo: 'FRO', descripcion: 'Islas Feroe' },
  { codigo: 'FIN', descripcion: 'Finlandia' },
  { codigo: 'ISL', descripcion: 'Islandia' },
  { codigo: 'IRL', descripcion: 'Irlanda' },
  { codigo: 'IMN', descripcion: 'Isla de Man' },
  { codigo: 'LVA', descripcion: 'Letonia' },
  { codigo: 'LTU', descripcion: 'Lituania' },
  { codigo: 'NOR', descripcion: 'Noruega' },
  { codigo: 'SJM', descripcion: 'Islas Svalbard y Jan Mayen' },
  { codigo: 'SWE', descripcion: 'Suecia' },
  { codigo: 'GBR', descripcion: 'Reino Unido de Gran Bretaña e Irlanda del Norte' },
  { codigo: 'ALB', descripcion: 'Albania' },
  { codigo: 'AND', descripcion: 'Andorra' },
  { codigo: 'BIH', descripcion: 'Bosnia y Herzegovina' },
  { codigo: 'HRV', descripcion: 'Croacia' },
  { codigo: 'GIB', descripcion: 'Gibraltar' },
  { codigo: 'GRC', descripcion: 'Grecia' },
  { codigo: 'VAT', descripcion: 'Santa Sede' },
  { codigo: 'ITA', descripcion: 'Italia' },
  { codigo: 'MLT', descripcion: 'Malta' },
  { codigo: 'MNE', descripcion: 'Montenegro' },
  { codigo: 'PRT', descripcion: 'Portugal' },
  { codigo: 'SMR', descripcion: 'San Marino' },
  { codigo: 'SRB', descripcion: 'Serbia' },
  { codigo: 'SVN', descripcion: 'Eslovenia' },
  { codigo: 'ESP', descripcion: 'España' },
  { codigo: 'MKD', descripcion: 'ex República Yugoslava de Macedonia' },
  { codigo: 'AUT', descripcion: 'Austria' },
  { codigo: 'BEL', descripcion: 'Bélgica' },
  { codigo: 'FRA', descripcion: 'Francia' },
  { codigo: 'DEU', descripcion: 'Alemania' },
  { codigo: 'LIE', descripcion: 'Liechtenstein' },
  { codigo: 'LUX', descripcion: 'Luxemburgo' },
  { codigo: 'MCO', descripcion: 'Mónaco' },
  { codigo: 'NLD', descripcion: 'Países Bajos' },
  { codigo: 'CHE', descripcion: 'Suiza' },
  { codigo: 'AUS', descripcion: 'Australia' },
  { codigo: 'CXR', descripcion: 'Isla de Navidad' },
  { codigo: 'CCK', descripcion: 'Islas Cocos (Keeling)' },
  { codigo: 'HMD', descripcion: 'Islas Heard y McDonald' },
  { codigo: 'NZL', descripcion: 'Nueva Zelandia' },
  { codigo: 'NFK', descripcion: 'Islas Norfolk' },
  { codigo: 'FJI', descripcion: 'Fiji' },
  { codigo: 'NCL', descripcion: 'Nueva Caledonia' },
  { codigo: 'PNG', descripcion: 'Papua Nueva Guinea' },
  { codigo: 'SLB', descripcion: 'Islas Salomón' },
  { codigo: 'VUT', descripcion: 'Vanuatu' },
  { codigo: 'GUM', descripcion: 'Guam' },
  { codigo: 'KIR', descripcion: 'Kiribati' },
  { codigo: 'MHL', descripcion: 'Islas Marshall' },
  { codigo: 'FSM', descripcion: 'Micronesia (Estados Federados de)' },
  { codigo: 'NRU', descripcion: 'Nauru' },
  { codigo: 'MNP', descripcion: 'Islas Marianas Septentrionales' },
  { codigo: 'PLW', descripcion: 'Palau' },
  { codigo: 'UMI', descripcion: 'Islas menores alejadas de Estados Unidos' },
  { codigo: 'ASM', descripcion: 'Samoa Americana' },
  { codigo: 'COK', descripcion: 'Islas Cook' },
  { codigo: 'PYF', descripcion: 'Polinesia Francesa' },
  { codigo: 'NIU', descripcion: 'Niue' },
  { codigo: 'PCN', descripcion: 'Pitcairn' },
  { codigo: 'WSM', descripcion: 'Samoa' },
  { codigo: 'TKL', descripcion: 'Tokelau' },
  { codigo: 'TON', descripcion: 'Tonga' },
  { codigo: 'TUV', descripcion: 'Tuvalu' },
  { codigo: 'WLF', descripcion: 'Islas Wallis y Futuna' },
  { codigo: 'NN', descripcion: 'NO EXISTE' },
];
