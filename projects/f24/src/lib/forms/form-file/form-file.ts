import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, OnDestroy, input, output, ElementRef, ViewChild } from '@angular/core';
import { NgControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ControlValueAccessor } from '../control-value';
import { FormErrors } from '../form-errors';

/**
 * FormFile
 */
@Component({
  selector: 'f24-form-file',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
    FormErrors
  ],
  templateUrl: './form-file.html',
  styleUrl: './form-file.scss',
})
export class FormFile extends ControlValueAccessor implements OnInit, OnDestroy {
  /**
   * ViewChild para acceder al input file nativo
   */
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /**
   * inputs
   */
  public label = input<string>('Seleccionar archivo');
  public placeholder = input<string>('Ningún archivo seleccionado');
  public accept = input<string>('*/*'); // Ejemplo: 'image/*', '.pdf,.doc,.docx', etc.
  public multiple = input<boolean>(false);
  public formControl = input<AbstractControl | null>(null);
  public maxFileSize = input<number>(0); // En bytes, 0 = sin límite
  public allowedTypes = input<string[]>([]); // Tipos MIME permitidos

  /**
   * outputs
   */
  public fileSelected = output<File | File[] | null>();
  public fileCleared = output<void>();
  public validationError = output<{ type: string; message: string }>();

  /**
   * Estado interno
   */
  public selectedFileName: string = '';
  public isDragOver: boolean = false;

  /**
   * injects
   */
  private ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  /**
   * constructor
   */
  constructor() {
    super();

    // Configurar el value accessor
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.init(this.ngControl, this.formControl());
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy(this.ngControl);
  }

  /**
   * Maneja la selección de archivos
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.clearFile();
      return;
    }

    const fileList = this.multiple() ? Array.from(files) : files[0];

    // Validar archivos
    if (this.validateFiles(fileList)) {
      this.processFiles(fileList);
    } else {
      this.clearFile();
      input.value = ''; // Limpiar el input
    }
  }

  /**
   * Valida los archivos seleccionados
   */
  private validateFiles(files: File | File[]): boolean {
    const fileArray = Array.isArray(files) ? files : [files];

    for (const file of fileArray) {
      // Validar tamaño
      if (this.maxFileSize() > 0 && file.size > this.maxFileSize()) {
        const error = {
          type: 'maxFileSize',
          message: `El archivo ${file.name} excede el tamaño máximo permitido`
        };
        this.validationError.emit(error);
        return false;
      }

      // Validar tipo
      if (this.allowedTypes().length > 0 && !this.allowedTypes().includes(file.type)) {
        const error = {
          type: 'fileType',
          message: `El tipo de archivo ${file.type} no está permitido`
        };
        this.validationError.emit(error);
        return false;
      }
    }

    return true;
  }

  /**
   * Procesa los archivos válidos
   */
  private processFiles(files: File | File[]): void {
    if (Array.isArray(files)) {
      this.selectedFileName = `${files.length} archivo(s) seleccionado(s)`;
      this.control().setValue(files);
      this.fileSelected.emit(files);
    } else {
      this.selectedFileName = files.name;
      this.control().setValue(files);
      this.fileSelected.emit(files);
    }

    //this.onChange(files);
    //this.onTouched();
  }

  /**
   * Limpia el archivo seleccionado
   */
  clearFile(): void {
    this.selectedFileName = '';
    this.control().setValue(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileCleared.emit();
    //this.onChange(null);
  }

  /**
   * Maneja el evento de drag over
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  /**
   * Maneja el evento de drag leave
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  /**
   * Maneja el evento de drop
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const fileList = this.multiple() ? Array.from(files) : files[0];

      if (this.validateFiles(fileList)) {
        this.processFiles(fileList);
      }
    }
  }

  /**
   * Abre el selector de archivos
   */
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * Implementación requerida por ControlValueAccessor
   */
  override writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.clearFile();
    } else if (value instanceof File) {
      this.selectedFileName = value.name;
    } else if (Array.isArray(value) && value.every(item => item instanceof File)) {
      this.selectedFileName = `${value.length} archivo(s) seleccionado(s)`;
    }
  }
}
