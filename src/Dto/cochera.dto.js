export class CocheraDTO {
    constructor(numero, propietario, estado, ocupaciones) {
      this.numero = numero;
      this.propietario = propietario;
      this.estado = estado;
      this.ocupaciones = ocupaciones;
    }
  }
  
  export class CocheraUpdateDTO {
    constructor(estado) {
      this.estado = estado;
    }
  }
  
  export class OcupacionDTO {
    constructor(usuario, vehiculo, tiempoInicio) {
      this.usuario = usuario;
      this.vehiculo = vehiculo;
      this.tiempoInicio = tiempoInicio;
    }
  }
  
  export class LiberarCocheraDTO {
    constructor(tiempoFin, costo) {
      this.tiempoFin = tiempoFin;
      this.costo = costo;
    }
  }
  