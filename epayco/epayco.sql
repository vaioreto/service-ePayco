-- MySQL Script generated by MySQL Workbench
-- mié 12 may 2021 17:46:28
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema EPAYCO
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `EPAYCO` ;

-- -----------------------------------------------------
-- Schema EPAYCO
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `EPAYCO` ;
USE `EPAYCO` ;

-- -----------------------------------------------------
-- Table `EPAYCO`.`Clientes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `EPAYCO`.`Clientes` ;

CREATE TABLE IF NOT EXISTS `EPAYCO`.`Clientes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `documento` VARCHAR(225) NOT NULL,
  `nombre` VARCHAR(225) NOT NULL,
  `email` VARCHAR(225) NOT NULL,
  `celular` VARCHAR(225) NOT NULL,
  `password` VARCHAR(225) NOT NULL,
  `createdAt` VARCHAR(225) NOT NULL,
  `updatedAt` VARCHAR(225) NULL,
  `deletedAt` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `documento_UNIQUE` (`documento` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `EPAYCO`.`Billeteras`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `EPAYCO`.`Billeteras` ;

CREATE TABLE IF NOT EXISTS `EPAYCO`.`Billeteras` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idCliente` INT NOT NULL,
  `saldo` FLOAT NOT NULL DEFAULT 0,
  `createdAt` VARCHAR(225) NOT NULL,
  `updatedAt` VARCHAR(225) NULL,
  `deletedAt` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_billetera_clientes_idx` (`idCliente` ASC) VISIBLE,
  UNIQUE INDEX `idCliente_UNIQUE` (`idCliente` ASC) VISIBLE,
  CONSTRAINT `fk_billetera_clientes`
    FOREIGN KEY (`idCliente`)
    REFERENCES `EPAYCO`.`Clientes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `EPAYCO`.`ConfirmarPagos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `EPAYCO`.`ConfirmarPagos` ;

CREATE TABLE IF NOT EXISTS `EPAYCO`.`ConfirmarPagos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sessionToken` LONGTEXT NOT NULL,
  `tokenPago` NVARCHAR(6) NOT NULL,
  `monto` FLOAT NOT NULL,
  `pagado` TINYINT NOT NULL DEFAULT 0,
  `descripcion` VARCHAR(225) NOT NULL,
  `idCliente` INT NOT NULL,
  `createdAt` VARCHAR(225) NOT NULL,
  `updateddAt` VARCHAR(225) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_ConfirmarPago_Clientes1_idx` (`idCliente` ASC) VISIBLE,
  CONSTRAINT `fk_ConfirmarPago_Clientes1`
    FOREIGN KEY (`idCliente`)
    REFERENCES `EPAYCO`.`Clientes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;